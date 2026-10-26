<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
ini_set('display_errors', '0');
ini_set('session.use_strict_mode', '1');
ini_set('session.gc_maxlifetime', '604800');
session_name('siprate_session');
session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => getenv('SECURE_COOKIES') === '1', 'httponly' => true, 'samesite' => 'Lax']);
if (!session_start()) respond(['error' => 'Session storage is unavailable. Please contact the site administrator.'], 503);
$_SESSION['csrf'] ??= bin2hex(random_bytes(32));

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $path = rtrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
    if (!in_array($method, ['GET', 'POST', 'PUT', 'DELETE'], true)) throw new ApiError(405, 'Method not allowed.');
    if ($method !== 'GET' && !hash_equals($_SESSION['csrf'], $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) throw new ApiError(403, 'Your session changed. Refresh the page and try again.');

    if ($path === '/api/health' && $method === 'GET') { query('SELECT 1'); respond(['ok' => true]); }
    if ($path === '/api/auth/me' && $method === 'GET') respond(['user' => user(), 'csrf' => $_SESSION['csrf']]);

    if ($path === '/api/auth/register' && $method === 'POST') {
        $data = body();
        $name = field($data, 'name', 2, 80);
        $email = strtolower(field($data, 'email', 3, 254));
        $password = $data['password'] ?? '';
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) throw new ApiError(422, 'Please enter a valid email address.');
        if (!is_string($password) || strlen($password) < 8 || strlen($password) > 72 || str_contains($password, "\0")) throw new ApiError(422, 'Password must be 8 to 72 bytes.');
        db()->beginTransaction();
        try {
            query('INSERT INTO Account (Email,Password,Active) VALUES (?,?,1)', [$email, password_hash($password, PASSWORD_BCRYPT)]);
            $accountId = db()->lastInsertId();
            query('INSERT INTO `User` (Name,AccountID,Active) VALUES (?,?,1)', [$name, $accountId]);
            $id = (int)db()->lastInsertId();
            db()->commit();
        } catch (PDOException $e) {
            db()->rollBack();
            if (($e->errorInfo[1] ?? null) === 1062) throw new ApiError(409, 'An account with this email already exists. Please log in.');
            throw $e;
        }
        signIn($id);
        respond(['user' => user(), 'csrf' => $_SESSION['csrf']], 201);
    }

    if ($path === '/api/auth/login' && $method === 'POST') {
        $data = body();
        $email = strtolower(field($data, 'email', 3, 254));
        $password = $data['password'] ?? '';
        if (!is_string($password) || strlen($password) > 72 || str_contains($password, "\0")) throw new ApiError(422, 'Please enter a valid password.');
        $key = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|' . $email);
        query('DELETE FROM LoginAttempt WHERE Created < DATE_SUB(NOW(), INTERVAL 15 MINUTE)');
        $attempts = (int)query('SELECT COUNT(*) FROM LoginAttempt WHERE AttemptKey=?', [$key])->fetchColumn();
        if ($attempts >= 10) throw new ApiError(429, 'Too many attempts. Please try again in 15 minutes.');
        $row = query('SELECT a.Password,u.UserID FROM Account a JOIN `User` u ON u.AccountID=a.AccountID WHERE a.Email=? AND a.Active=1 AND u.Active=1', [$email])->fetch();
        if (!$row || !password_verify($password, $row['Password'])) {
            query('INSERT INTO LoginAttempt (AttemptKey) VALUES (?)', [$key]);
            throw new ApiError(401, 'Email or password is incorrect.');
        }
        query('DELETE FROM LoginAttempt WHERE AttemptKey=?', [$key]);
        signIn((int)$row['UserID'], ($data['remember'] ?? false) === true);
        respond(['user' => user(), 'csrf' => $_SESSION['csrf']]);
    }
    if ($path === '/api/auth/logout' && $method === 'POST') {
        $_SESSION = [];
        session_regenerate_id(true);
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
        setcookie(session_name(), session_id(), ['expires' => 0, 'path' => '/', 'secure' => getenv('SECURE_COOKIES') === '1', 'httponly' => true, 'samesite' => 'Lax']);
        respond(['user' => null, 'csrf' => $_SESSION['csrf']]);
    }

    if ($path === '/api/cafes' && $method === 'GET') {
        $conditions = ['p.Active=1']; $args = [];
        $search = trim(is_string($_GET['q'] ?? '') ? $_GET['q'] ?? '' : '');
        if (mb_strlen($search) > 100) throw new ApiError(422, 'Search is too long.');
        if ($search !== '') { $conditions[] = '(p.Name LIKE ? OR p.Suburb LIKE ? OR p.BeanOrigin LIKE ?)'; $args = array_fill(0, 3, '%' . $search . '%'); }
        $style = $_GET['style'] ?? '';
        if (in_array($style, ['Espresso','Filter','Cold brew','Specialty'], true)) { $conditions[] = 'p.CoffeeStyle LIKE ?'; $args[] = '%' . $style . '%'; }
        $random = ($_GET['random'] ?? '') === '1';
        $rows = query(cafeSelect() . ' WHERE ' . implode(' AND ', $conditions) . ($random ? ' ORDER BY RAND() LIMIT 3' : ' ORDER BY p.Name'), $args)->fetchAll();
        respond(['cafes' => array_map('cafeTypes', $rows)]);
    }
    if (preg_match('#^/api/cafes/([1-9][0-9]*)$#', $path, $match) && $method === 'GET') {
        $id = (int)$match[1];
        $item = cafe($id);
        $reviews = query(reviewSelect() . ' WHERE r.ProductID=? AND r.Active=1 ORDER BY r.Created DESC,r.ReviewID DESC', [$id])->fetchAll();
        respond(['cafe' => $item, 'reviews' => array_map('reviewTypes', $reviews)]);
    }

    if ($path === '/api/favourites' && $method === 'GET') {
        $user = requireUser();
        $rows = query(cafeSelect() . ' JOIN Favourite f ON f.ProductID=p.ProductID WHERE f.UserID=? AND p.Active=1 ORDER BY f.Created DESC', [$user['id']])->fetchAll();
        respond(['cafes' => array_map('cafeTypes', $rows)]);
    }
    if (preg_match('#^/api/favourites/([1-9][0-9]*)$#', $path, $match) && in_array($method, ['PUT','DELETE'], true)) {
        $user = requireUser(); $id = (int)$match[1]; cafe($id);
        if ($method === 'PUT') query('INSERT INTO Favourite (UserID,ProductID) VALUES (?,?) ON DUPLICATE KEY UPDATE ProductID=VALUES(ProductID)', [$user['id'], $id]);
        else query('DELETE FROM Favourite WHERE UserID=? AND ProductID=?', [$user['id'], $id]);
        respond(['saved' => $method === 'PUT']);
    }

    if ($path === '/api/account' && $method === 'PUT') {
        $user = requireUser(); $name = field(body(), 'name', 2, 80);
        query('UPDATE `User` SET Name=? WHERE UserID=?', [$name, $user['id']]);
        respond(['user' => user()]);
    }
    if ($path === '/api/reviews/mine' && $method === 'GET') {
        $user = requireUser();
        respond(['reviews' => array_map('reviewTypes', query(reviewSelect() . ' WHERE r.UserID=? AND r.Active=1 ORDER BY r.Created DESC', [$user['id']])->fetchAll())]);
    }
    if (($path === '/api/reviews' && $method === 'POST') || (preg_match('#^/api/reviews/([1-9][0-9]*)$#', $path, $match) && $method === 'PUT')) {
        $user = requireUser(); $data = body();
        $id = $method === 'PUT' ? (int)$match[1] : null;
        if ($id) {
            $existing = query('SELECT UserID,ProductID FROM Review WHERE ReviewID=? AND Active=1', [$id])->fetch();
            if (!$existing) throw new ApiError(404, 'Review not found.');
            if ((int)$existing['UserID'] !== $user['id']) throw new ApiError(403, 'You can only edit your own reviews.');
            $cafeId = (int)$existing['ProductID'];
        } else {
            $cafeId = filter_var($data['cafeId'] ?? null, FILTER_VALIDATE_INT);
            if (!$cafeId || $cafeId < 1) throw new ApiError(422, 'Select a valid café.');
        }
        cafe($cafeId);
        $title = field($data, 'title', 3, 80); $text = field($data, 'body', 10, 2000);
        $scores = [];
        foreach (['coffee','atmosphere','service'] as $key) {
            $score = $data[$key] ?? null;
            if (!is_int($score) || $score < 1 || $score > 5) throw new ApiError(422, 'Please give each category a rating from 1 to 5.');
            $scores[] = $score;
        }
        if ($id) query('UPDATE Review SET Title=?,Body=?,Rating=?,AtmosphereRating=?,ServiceRating=? WHERE ReviewID=? AND UserID=?', [$title,$text,...$scores,$id,$user['id']]);
        else {
            try { query('INSERT INTO Review (Title,Body,Rating,AtmosphereRating,ServiceRating,ProductID,UserID) VALUES (?,?,?,?,?,?,?)', [$title,$text,...$scores,$cafeId,$user['id']]); }
            catch (PDOException $e) { if (($e->errorInfo[1] ?? null) === 1062) throw new ApiError(409, 'You already reviewed this café. Edit your review from My account.'); throw $e; }
            $id = (int)db()->lastInsertId();
        }
        respond(['id' => $id, 'cafeId' => $cafeId], $method === 'POST' ? 201 : 200);
    }
    if (preg_match('#^/api/reviews/([1-9][0-9]*)$#', $path, $match) && $method === 'DELETE') {
        $user = requireUser();
        $existing = query('SELECT UserID FROM Review WHERE ReviewID=?', [(int)$match[1]])->fetch();
        if (!$existing) throw new ApiError(404, 'Review not found.');
        if ((int)$existing['UserID'] !== $user['id']) throw new ApiError(403, 'You can only delete your own reviews.');
        query('DELETE FROM Review WHERE ReviewID=? AND UserID=?', [(int)$match[1], $user['id']]);
        respond(['deleted' => true]);
    }
    throw new ApiError(404, 'Endpoint not found.');
} catch (ApiError $e) { respond(['error' => $e->getMessage()], $e->status); }
catch (Throwable $e) {
    error_log('Sip & Rate API: ' . $e->getMessage());
    respond(['error' => 'The service is temporarily unavailable. Please try again shortly.'], 503);
}
