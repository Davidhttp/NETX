<?php
declare(strict_types=1);

require_once __DIR__ . '/env.php';

function netx_config(): array
{
    return [
        'db' => [
            'host'    => (string)env('DB_HOST', '127.0.0.1'),
            'port'    => (int)env('DB_PORT', 3306),
            'name'    => (string)env('DB_NAME', 'netx_db'),
            'user'    => (string)env('DB_USER', 'root'),
            'pass'    => (string)env('DB_PASS', ''),
            'charset' => (string)env('DB_CHARSET', 'utf8mb4'),
        ],
        'session' => [
            'name'     => (string)env('SESSION_NAME', 'NETXSESSID'),
            'lifetime' => (int)env('SESSION_LIFETIME', 28800),
        ],
    ];
}

function netx_db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $db  = netx_config()['db'];
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $db['host'], $db['port'], $db['name'], $db['charset']
    );

    $pdo = new PDO($dsn, $db['user'], $db['pass'], [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
    $pdo->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");

    return $pdo;
}