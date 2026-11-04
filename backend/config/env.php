<?php
declare(strict_types=1);

/**
 * NETX · env.php
 * Cargador mínimo de .env (sin dependencias). Uso: env('DB_HOST', '127.0.0.1')
 * Busca el archivo en la raíz del proyecto: NETX/.env
 * Las variables reales del sistema tienen prioridad sobre el .env.
 */

function netx_load_env(?string $path = null): void
{
    static $loaded = false;
    if ($loaded) { return; }
    $loaded = true;

    $path ??= dirname(__DIR__, 2) . '/.env';
    if (!is_file($path)) { return; }

    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) { continue; }

        [$key, $value] = array_map('trim', explode('=', $line, 2));

        if (preg_match('/^(["\'])(.*)\1/', $value, $m)) {
            $value = $m[2];                                   // valor entre comillas
        } else {
            $value = trim(preg_replace('/\s+#.*$/', '', $value)); // quita comentario al final
        }

        if (getenv($key) !== false || isset($_ENV[$key])) { continue; } // no pisar variables reales
        $_ENV[$key] = $value;
        putenv("$key=$value");
    }
}

function env(string $key, mixed $default = null): mixed
{
    netx_load_env();
    $v = $_ENV[$key] ?? getenv($key);
    if ($v === false || $v === null) { return $default; }

    return match (strtolower((string)$v)) {
        'true'  => true,
        'false' => false,
        'null'  => null,
        default => $v,
    };
}