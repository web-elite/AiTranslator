<?php
require_once dirname(__DIR__) . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

$allowed_types = [
    'css'   => 'text/css',
    'js'    => 'application/javascript',
    'woff'  => 'font/woff',
    'woff2' => 'font/woff2',
    'ttf'   => 'font/ttf',
];

$file = $_GET['file'] ?? '';

if ($file) {
    $file = ltrim($file, '/'); // Remove leading slash if exists
    $fullPath = dirname(__DIR__) . '/' . $file;
    $ext = pathinfo($file, PATHINFO_EXTENSION);

    // Validate file type
    if (!isset($allowed_types[$ext])) {
        header("HTTP/1.1 403 Forbidden");
        exit("Forbidden file type.");
    }

    // Check if file exists
    if (!file_exists($fullPath)) {
        error_log("File not found: " . $fullPath);
        header("HTTP/1.1 404 Not Found");
        exit("File not found.");
    }

    // Set caching headers
    header("Content-Type: " . $allowed_types[$ext]);
    header("Cache-Control: public, max-age=31536000");
    header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');

    // Check if Redis is enabled
    if (!isset($_ENV['REDIS_URL']) || empty($_ENV['REDIS_URL'])) {
        readfile($fullPath);
        exit;
    }
}

// Connect to Redis
try {
    $redis = new Redis();
    $redis->connect($_ENV['REDIS_URL']);
} catch (Exception $e) {
    error_log("Redis connection failed: " . $e->getMessage());
    readfile($fullPath);
    exit;
}

// Redis cache clear
if ($_GET['cache'] == 'clear') {
    $redis->flushAll();
    echo "All cache cleared!";
    header('location: /');
    exit;
}

// Define cache key
$cacheKey = "cache:" . md5($file);

// Try to fetch from Redis
$cachedData = $redis->get($cacheKey);
if (!$cachedData) {
    $cachedData = file_get_contents($fullPath);
    $redis->setex($cacheKey, 86400, $cachedData); // Cache for 1 day
}

// Output file content
echo $cachedData;
exit;
