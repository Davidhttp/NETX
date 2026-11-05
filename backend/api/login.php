<?php
declare(strict_types=1);

/**
 * NETX · POST /backend/api/login.php   (HU-01, HU-02)
 * Body JSON: { "email": "...", "password": "..." }
 * Valida contra MySQL (usuarios + roles + miembros) y abre sesión PHP.
 */

require_once __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['success' => false, 'message' => 'Método no permitido.'], 405);
}
if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') === false) {
    json_out(['success' => false, 'message' => 'Se esperaba application/json.'], 415);
}

$body     = json_decode(file_get_contents('php://input') ?: '', true) ?? [];
$email    = strtolower(trim((string)($body['email'] ?? '')));
$password = (string)($body['password'] ?? '');

if ($email === '' || $password === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) > 200) {
    json_out(['success' => false, 'message' => 'Ingresa un correo y una contraseña válidos.'], 422);
}

netx_session_start();

// Freno básico contra fuerza bruta: 5 fallos => 60 s de espera.
$now = time();
if (($_SESSION['login_fails'] ?? 0) >= 5 && ($now - ($_SESSION['login_last_fail'] ?? 0)) < 60) {
    json_out(['success' => false, 'message' => 'Demasiados intentos. Espera un minuto.'], 429);
}

$stmt = netx_db()->prepare(
    'SELECT u.id_usuario, u.nombre, u.correo, u.password_hash, u.activo AS usuario_activo,
            r.nombre AS rol,
            m.id_miembro, m.empresa, m.telefono, m.fecha_ingreso, m.activo AS miembro_activo,
            c.nombre AS giro
       FROM usuarios u
       JOIN roles r           ON r.id_rol = u.id_rol
  LEFT JOIN miembros m        ON m.id_usuario = u.id_usuario
  LEFT JOIN categorias c      ON c.id_categoria = m.id_categoria
      WHERE u.correo = :correo
      LIMIT 1'
);
$stmt->execute([':correo' => $email]);
$u = $stmt->fetch();

// Se verifica siempre un hash para igualar tiempos y no revelar si el correo existe.
static $dummy = null;
$dummy ??= password_hash('netx-dummy', PASSWORD_BCRYPT);
$ok = password_verify($password, $u['password_hash'] ?? $dummy) && $u !== false;

if (!$ok) {
    $_SESSION['login_fails']     = ($_SESSION['login_fails'] ?? 0) + 1;
    $_SESSION['login_last_fail'] = $now;
    json_out(['success' => false, 'message' => 'Correo o contraseña incorrectos.'], 401);
}

// Credenciales correctas: ahora sí se revisa el estado de la cuenta.
if (!(int)$u['usuario_activo'] || ($u['id_miembro'] !== null && !(int)$u['miembro_activo'])) {
    json_out(['success' => false, 'message' => 'La cuenta está inactiva o dada de baja. Contacta a la directiva.'], 403);
}

// Actualiza el hash si el algoritmo por defecto de PHP mejoró.
if (password_needs_rehash($u['password_hash'], PASSWORD_DEFAULT)) {
    netx_db()->prepare('UPDATE usuarios SET password_hash = ? WHERE id_usuario = ?')
        ->execute([password_hash($password, PASSWORD_DEFAULT), $u['id_usuario']]);
}

session_regenerate_id(true);
unset($_SESSION['login_fails'], $_SESSION['login_last_fail']);

$user = [
    'id'           => (int)$u['id_usuario'],
    'idMiembro'    => $u['id_miembro'] !== null ? (int)$u['id_miembro'] : null,
    'nombre'       => $u['nombre'],
    'email'        => $u['correo'],
    'rol'          => netx_rol_label($u['rol']),      // Administrador | Coordinador | Miembro
    'rolClave'     => strtolower($u['rol']),          // administrador | coordinador | miembro
    'empresa'      => $u['empresa'],
    'telefono'     => $u['telefono'],
    'giro'         => $u['giro'],
    'fechaIngreso' => $u['fecha_ingreso'],
    'estatus'      => 'Activo',
    'avatar'       => mb_strtoupper(mb_substr($u['nombre'], 0, 1)),
    'paginas'      => netx_role_pages($u['rol']),     // páginas que su rol puede abrir
];
$_SESSION['user'] = $user;

json_out(['success' => true, 'user' => $user, 'redirect' => 'index.html']);