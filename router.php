<?php
/**
 * NETX · router.php — solo para desarrollo con el servidor embebido de PHP:
 *   php -S localhost:8000 router.php
 * Impide que se descargue .env, archivos ocultos y el código de configuración.
 */
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';

if (preg_match('#(^|/)\.#', $path)                      // .env, .git, .gitignore...
    || str_starts_with($path, '/backend/config')
    || str_starts_with($path, '/backend/scripts')
    || str_starts_with($path, '/database')) {
    http_response_code(404);
    exit('Not found');
}
return false; // sirve el archivo solicitado normalmente