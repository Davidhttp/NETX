<?php
declare(strict_types=1);

/**
 * NETX · GET /backend/api/members.php
 * Lista de miembros ACTIVOS desde MySQL (solo lectura), para llenar selects
 * como el receptor de un referido. Requiere sesión.
 */

require_once __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('Allow: GET');
    json_out(['success' => false, 'message' => 'Método no permitido.'], 405);
}

netx_require_login();

$st = netx_db()->query(
    'SELECT m.id_miembro, m.nombre, m.empresa, c.nombre AS giro
       FROM miembros m
       JOIN categorias c ON c.id_categoria = m.id_categoria
      WHERE m.activo = TRUE
      ORDER BY m.nombre'
);

$miembros = array_map(fn(array $m) => [
    'id'      => (int)$m['id_miembro'],
    'nombre'  => $m['nombre'],
    'empresa' => $m['empresa'],
    'giro'    => $m['giro'],
], $st->fetchAll());

json_out(['success' => true, 'miembros' => $miembros]);
