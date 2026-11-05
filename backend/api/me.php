<?php
declare(strict_types=1);

/**
 * NETX · GET /backend/api/me.php
 * Devuelve el usuario de la sesión PHP (o 401). Revalida contra la BD que la
 * cuenta siga activa, así una baja surte efecto en la siguiente carga de página.
 */

require_once __DIR__ . '/_bootstrap.php';

$user = netx_require_login();

$st = netx_db()->prepare(
    'SELECT u.activo AS usuario_activo, m.activo AS miembro_activo
       FROM usuarios u
  LEFT JOIN miembros m ON m.id_usuario = u.id_usuario
      WHERE u.id_usuario = ?'
);
$st->execute([$user['id']]);
$row = $st->fetch();

if (!$row || !(int)$row['usuario_activo'] || ($row['miembro_activo'] !== null && !(int)$row['miembro_activo'])) {
    $_SESSION = [];
    session_destroy();
    json_out(['success' => false, 'message' => 'Cuenta inactiva.'], 401);
}

$user['paginas'] = netx_role_pages($user['rolClave'] ?? 'miembro');
json_out(['success' => true, 'user' => $user]);