<?php
declare(strict_types=1);

/**
 * NETX · _bootstrap.php
 * Utilidades comunes de los endpoints: JSON, sesión segura y errores.
 */

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function json_out(array $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function netx_session_start(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $cfg   = netx_config()['session'] ?? [];
    $https = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';

    session_name($cfg['name'] ?? 'NETXSESSID');
    session_set_cookie_params([
        'lifetime' => $cfg['lifetime'] ?? 28800,
        'path'     => '/',
        'secure'   => $https,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

/** Mapea el nombre del rol en BD al texto que usa el frontend. */
function netx_rol_label(string $rolBd): string
{
    return [
        'administrador' => 'Administrador',
        'coordinador'   => 'Coordinador',
        'miembro'       => 'Miembro',
    ][strtolower($rolBd)] ?? 'Miembro';
}

set_exception_handler(function (Throwable $e) {
    error_log('[NETX] ' . $e->getMessage());
    json_out(['success' => false, 'message' => 'Error interno del servidor.'], 500);
});