<?php
declare(strict_types=1);

/** NETX · GET /backend/api/me.php — devuelve el usuario de la sesión PHP (o 401). */

require_once __DIR__ . '/_bootstrap.php';
netx_session_start();

if (empty($_SESSION['user'])) {
    json_out(['success' => false, 'message' => 'No autenticado.'], 401);
}
json_out(['success' => true, 'user' => $_SESSION['user']]);