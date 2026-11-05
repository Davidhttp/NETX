<?php
declare(strict_types=1);

/**
 * NETX · auth.php
 * Sesión, roles y permisos por página. Fuente ÚNICA de la matriz de acceso:
 * la usan router.php (bloqueo de rutas), login.php/me.php (se la envían al
 * frontend) y los endpoints de la API (netx_require_role).
 */

require_once __DIR__ . '/database.php';

/** Páginas (claves del sidebar) permitidas por rol. */
const NETX_PAGINAS = [
    'administrador' => ['panel', 'miembros', 'reglas', 'reuniones', 'referidos', 'perfil'],
    'coordinador'   => ['panel', 'reuniones', 'referidos', 'perfil'],
    'miembro'       => ['panel', 'reuniones', 'referidos', 'perfil'],
];

/** Nombre de archivo (sin extensión) => clave de página. */
const NETX_ARCHIVO_A_PAGINA = [
    'index'     => 'panel',
    'miembros'  => 'miembros',
    'reglas'    => 'reglas',
    'reuniones' => 'reuniones',
    'referidos' => 'referidos',
    'perfil'    => 'perfil',
];

function netx_role_pages(string $rolClave): array
{
    return NETX_PAGINAS[strtolower($rolClave)] ?? ['panel', 'perfil'];
}

/** ¿Puede este rol abrir el archivo (ej. "miembros")? Archivos no mapeados: sí, si hay sesión. */
function netx_page_allowed(string $rolClave, string $archivo): bool
{
    $clave = NETX_ARCHIVO_A_PAGINA[$archivo] ?? null;
    return $clave === null || in_array($clave, netx_role_pages($rolClave), true);
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

function netx_current_user(): ?array
{
    netx_session_start();
    return $_SESSION['user'] ?? null;
}

/** Para endpoints JSON: exige sesión (401). Requiere json_out() de _bootstrap.php. */
function netx_require_login(): array
{
    $u = netx_current_user();
    if (!$u) {
        json_out(['success' => false, 'message' => 'No autenticado.'], 401);
    }
    return $u;
}

/** Para endpoints JSON: exige uno de los roles indicados (403). Ej: netx_require_role('administrador'). */
function netx_require_role(string ...$roles): array
{
    $u = netx_require_login();
    if (!in_array($u['rolClave'] ?? '', $roles, true)) {
        json_out(['success' => false, 'message' => 'No tienes permiso para esta acción.'], 403);
    }
    return $u;
}