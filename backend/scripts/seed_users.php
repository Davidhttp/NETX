<?php
declare(strict_types=1);

/**
 * NETX · seed_usuarios.php  (solo línea de comandos)
 * Crea categorías, usuarios de prueba (con bcrypt) y sus fichas de miembro.
 * Uso:  php backend/scripts/seed_usuarios.php
 * Opcional: NETX_SEED_PASSWORD="otraClave" php backend/scripts/seed_usuarios.php
 */

if (PHP_SAPI !== 'cli') { http_response_code(403); exit('Solo CLI.'); }

require_once __DIR__ . '/../config/database.php';

$password = (string)env('NETX_SEED_PASSWORD', 'Netx2026*');
$hash     = password_hash($password, PASSWORD_BCRYPT);
$pdo      = netx_db();

$categorias = ['Servicios Financieros e Inversión', 'Diseño y Branding', 'Marketing y Publicidad',
               'IT / Desarrollo de Software', 'Legal y Notarial', 'Contabilidad y Finanzas',
               'Inmobiliaria y Bienes Raíces', 'Recursos Humanos y Capacitación', 'Seguros y Fianzas'];

$usuarios = [
    ['Diego Uriel Méndez Rodríguez',  'admin@netx.com',                'administrador', 'Servicios Financieros e Inversión', 'Valora Capital',  '443-120-4560'],
    ['Brayan Ramiro Reyes Cárdenas',  'coordinador@netx.com',          'coordinador',   'Diseño y Branding',                 'Estudio Prisma',  '443-234-5678'],
    ['Juan Pérez',                    'juan.perez@nexuscreativo.com',  'miembro',       'Marketing y Publicidad',            'Nexus Creativo',  '443-223-4561'],
];

$pdo->beginTransaction();
try {
    $insCat = $pdo->prepare('INSERT IGNORE INTO categorias (nombre) VALUES (?)');
    foreach ($categorias as $c) { $insCat->execute([$c]); }

    $insU = $pdo->prepare(
        'INSERT INTO usuarios (nombre, correo, password_hash, id_rol)
         VALUES (:n, :c, :h, (SELECT id_rol FROM roles WHERE nombre = :r))
         ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), password_hash = VALUES(password_hash),
                                 id_rol = VALUES(id_rol), activo = TRUE'
    );
    $selU = $pdo->prepare('SELECT id_usuario FROM usuarios WHERE correo = ?');
    $insM = $pdo->prepare(
        'INSERT INTO miembros (id_usuario, id_categoria, nombre, telefono, empresa, fecha_ingreso)
         VALUES (:u, (SELECT id_categoria FROM categorias WHERE nombre = :g), :n, :t, :e, CURDATE())
         ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), telefono = VALUES(telefono), empresa = VALUES(empresa)'
    );

    foreach ($usuarios as [$nombre, $correo, $rol, $giro, $empresa, $tel]) {
        $insU->execute([':n' => $nombre, ':c' => $correo, ':h' => $hash, ':r' => $rol]);
        $selU->execute([$correo]);
        $idU = (int)$selU->fetchColumn();
        $insM->execute([':u' => $idU, ':g' => $giro, ':n' => $nombre, ':t' => $tel, ':e' => $empresa]);
        echo "✔ $rol  $correo\n";
    }
    $pdo->commit();
    echo "\nListo. Contraseña de prueba: $password\n";
} catch (Throwable $e) {
    $pdo->rollBack();
    fwrite(STDERR, 'Error: ' . $e->getMessage() . "\n");
    exit(1);
}