<?php
declare(strict_types=1);

/**
 * NETX · _bootstrap.php
 * Utilidades comunes de los endpoints: JSON y errores.
 * (Sesión y roles viven en backend/config/auth.php)
 */

require_once __DIR__ . '/../config/auth.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function json_out(array $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

set_exception_handler(function (Throwable $e) {
    error_log('[NETX] ' . $e->getMessage());
    json_out(['success' => false, 'message' => 'Error interno del servidor.'], 500);
});