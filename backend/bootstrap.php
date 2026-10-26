<?php
declare(strict_types=1);

// No framework is required: the API uses PHP sessions and PDO, as taught in class.
$envFile = dirname(__DIR__) . '/.env';
if (is_readable($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) continue;
        [$key, $value] = explode('=', $line, 2);
        if (getenv(trim($key)) === false) putenv(trim($key) . '=' . trim($value, " \t\n\r\0\x0B\"'"));
    }
}

final class ApiError extends RuntimeException {
    public function __construct(public int $status, string $message) { parent::__construct($message); }
}

function db(): PDO {
    static $pdo;
    if (!$pdo) {
        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $port = getenv('DB_PORT') ?: '3306';
        $name = getenv('DB_DATABASE') ?: 'sip_rate';
        $pdo = new PDO("mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4", getenv('DB_USERNAME') ?: 'sip_rate', getenv('DB_PASSWORD') ?: '', [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        $pdo->exec("SET time_zone = '+00:00'");
    }
    return $pdo;
}

function query(string $sql, array $args = []): PDOStatement {
    $statement = db()->prepare($sql);
    $statement->execute($args);
    return $statement;
}

function respond(array $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    exit;
}

function body(): array {
    if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 16384) throw new ApiError(413, 'Request is too large.');
    if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) throw new ApiError(415, 'Send JSON data.');
    $raw = file_get_contents('php://input', false, null, 0, 16385);
    if (strlen($raw) > 16384) throw new ApiError(413, 'Request is too large.');
    try { $value = json_decode($raw, true, 32, JSON_THROW_ON_ERROR); }
    catch (JsonException) { throw new ApiError(400, 'Invalid JSON.'); }
    if (!is_array($value)) throw new ApiError(400, 'Invalid request.');
    return $value;
}

function field(array $data, string $key, int $min, int $max): string {
    if (!isset($data[$key]) || !is_string($data[$key])) throw new ApiError(422, "Please enter a valid $key.");
    $value = trim($data[$key]);
    if (mb_strlen($value) < $min || mb_strlen($value) > $max) throw new ApiError(422, ucfirst($key) . " must be $min to $max characters.");
    return $value;
}

function user(): ?array {
    if (!isset($_SESSION['user_id'])) return null;
    if (($_SESSION['expires_at'] ?? 0) < time()) { unset($_SESSION['user_id']); return null; }
    $row = query('SELECT u.UserID AS id, u.Name AS name, a.Email AS email, u.Created AS joined FROM `User` u JOIN Account a ON a.AccountID=u.AccountID WHERE u.UserID=? AND u.Active=1 AND a.Active=1', [$_SESSION['user_id']])->fetch();
    if (!$row) { unset($_SESSION['user_id']); return null; }
    $row['id'] = (int)$row['id'];
    return $row;
}

function requireUser(): array {
    $user = user();
    if (!$user) throw new ApiError(401, 'Please log in to continue.');
    return $user;
}

function signIn(int $id, bool $remember = false): void {
    session_regenerate_id(true);
    $_SESSION['user_id'] = $id;
    $_SESSION['expires_at'] = time() + ($remember ? 604800 : 7200);
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
    if ($remember) setcookie(session_name(), session_id(), ['expires' => $_SESSION['expires_at'], 'path' => '/', 'secure' => getenv('SECURE_COOKIES') === '1', 'httponly' => true, 'samesite' => 'Lax']);
}

// One shared query keeps list, detail and saved cards consistent. Ratings are calculated.
function cafeSelect(): string {
    return "SELECT p.ProductID AS id, p.Name AS name, p.Description AS description, p.Brand AS brand,
        p.Suburb AS suburb, p.CoffeeStyle AS style, p.BeanOrigin AS origin, p.Roast AS roast,
        p.TastingNotes AS notes, p.CoffeeDescription AS coffeeDescription,
        p.PriceFrom AS priceFrom, p.PriceTo AS priceTo,
        (SELECT i.Filename FROM Image i JOIN Product_Image pi ON pi.ImageID=i.ImageID WHERE pi.ProductID=p.ProductID AND i.Active=1 ORDER BY i.ImageID LIMIT 1) AS image,
        (SELECT ROUND(AVG(r.Rating),1) FROM Review r WHERE r.ProductID=p.ProductID AND r.Active=1) AS rating,
        (SELECT ROUND(AVG(r.AtmosphereRating),1) FROM Review r WHERE r.ProductID=p.ProductID AND r.Active=1) AS atmosphereRating,
        (SELECT ROUND(AVG(r.ServiceRating),1) FROM Review r WHERE r.ProductID=p.ProductID AND r.Active=1) AS serviceRating,
        (SELECT COUNT(*) FROM Review r WHERE r.ProductID=p.ProductID AND r.Active=1) AS reviewCount
        FROM Product p";
}

function cafeTypes(array $row): array {
    foreach (['id','reviewCount'] as $key) $row[$key] = (int)$row[$key];
    foreach (['priceFrom','priceTo','rating','atmosphereRating','serviceRating'] as $key) $row[$key] = $row[$key] === null ? null : (float)$row[$key];
    return $row;
}

function cafe(int $id): array {
    $row = query(cafeSelect() . ' WHERE p.ProductID=? AND p.Active=1', [$id])->fetch();
    if (!$row) throw new ApiError(404, 'This café could not be found.');
    return cafeTypes($row);
}

function reviewSelect(): string {
    return 'SELECT r.ReviewID AS id, r.ProductID AS cafeId, r.UserID AS userId, u.Name AS author, p.Name AS cafeName, r.Title AS title, r.Body AS body, r.Rating AS coffee, r.AtmosphereRating AS atmosphere, r.ServiceRating AS service, r.Created AS created FROM Review r JOIN `User` u ON u.UserID=r.UserID JOIN Product p ON p.ProductID=r.ProductID';
}

function reviewTypes(array $row): array {
    foreach (['id','cafeId','userId','coffee','atmosphere','service'] as $key) $row[$key] = (int)$row[$key];
    return $row;
}
