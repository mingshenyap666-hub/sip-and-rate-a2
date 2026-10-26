<?php
// Router for php -S; serves only the public directory, never source or .env.
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (str_starts_with($path, '/api/')) { require __DIR__ . '/api.php'; return true; }
return false;
