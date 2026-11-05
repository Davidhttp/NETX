<?php
/**
 * NETX · router.php — solo para desarrollo con el servidor embebido de PHP:
 *   php -S localhost:8000 router.php
 *  1. Impide descargar .env, archivos ocultos y código de configuración.
 *  2. Protege las páginas de /frontend: sin sesión => login; sin permiso de rol => dashboard.
 */
require_once __DIR__ . '/backend/config/auth.php';

$path = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/');

if (preg_match('#(^|/)\.#', $path)                      // .env, .git, .gitignore...
    || str_contains($path, '..')
    || str_starts_with($path, '/backend/config')
    || str_starts_with($path, '/backend/scripts')
    || str_starts_with($path, '/database')) {
    http_response_code(404);
    exit('Not found');
}

if ($path === '/') {
    header('Location: /frontend/login.html');
    exit;
}

// Páginas HTML de la app: /frontend/, /frontend/xxx.html, /frontend/xxx.htm
if (preg_match('#^/frontend/(?:([A-Za-z0-9_-]+)\.html?)?$#', $path, $m)) {
    $archivo = $m[1] ?? 'index';
    $user    = netx_current_user();

    if ($archivo === 'login') {
        if ($user) {                                    // ya autenticado: no mostrar login
            header('Location: /frontend/index.html');
            exit;
        }
        return false;
    }

    if (!$user) {                                       // RUTA PROTEGIDA: requiere sesión
        header('Location: /frontend/login.html');
        exit;
    }
    if (!netx_page_allowed($user['rolClave'] ?? '', $archivo)) {
        header('Location: /frontend/index.html?acceso=denegado');
        exit;
    }

    $file = __DIR__ . '/frontend/' . ($m[0] === '/frontend/' ? 'index.html' : basename($path));
    if (!is_file($file)) { return false; }

    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store');                  // evita ver páginas con "Atrás" tras cerrar sesión
    readfile($file);
    exit;
}

return false; // archivos estáticos (css, js, imágenes) y API