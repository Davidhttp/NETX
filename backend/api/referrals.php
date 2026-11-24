<?php
declare(strict_types=1);

/**
 * NETX · /backend/api/referrals.php   (HU-18, HU-19)
 *
 * GET  → lista de referidos desde MySQL.
 *        Filtros opcionales (query string): ?receptor=ID&generador=ID&estado=Contacto
 * POST → registra un referido. Body JSON:
 *        { "receptorId": 4, "prospectoNombre": "...", "prospectoEmpresa": "...",
 *          "necesidad": "...", "prospectoTelefono": "...", "prospectoEmail": "...",
 *          "giroRequerido": "...", "esUrgente": true }
 *        El generador es SIEMPRE el miembro de la sesión (no se acepta del cliente).
 *        Respuestas: 201 creado · 409 prospecto duplicado activo · 422 datos inválidos.
 */

require_once __DIR__ . '/_bootstrap.php';

const NETX_ESTADOS_REFERIDO = ['Referido', 'Contacto', 'Reunión 1-a-1', 'Oportunidad', 'Cotización', 'Ganado', 'Perdido'];
const NETX_ESTADOS_ACTIVOS  = ['Referido', 'Contacto', 'Reunión 1-a-1', 'Oportunidad', 'Cotización'];

/** SELECT base: referido + nombres de generador y receptor, con claves que ya usa el frontend. */
const NETX_SQL_REFERIDOS =
    'SELECT r.id, r.id_generador, g.nombre AS generador_nombre,
            r.id_receptor, rc.nombre AS receptor_nombre,
            r.prospecto_nombre, r.prospecto_empresa, r.prospecto_telefono, r.prospecto_email,
            r.giro_requerido, r.necesidad, r.es_urgente, r.estado, r.fecha_registro
       FROM referidos r
       JOIN miembros g  ON g.id_miembro  = r.id_generador
       JOIN miembros rc ON rc.id_miembro = r.id_receptor';

function netx_referido_json(array $r): array
{
    return [
        'id'                => (int)$r['id'],
        'generadorId'       => (int)$r['id_generador'],
        'generadorNombre'   => $r['generador_nombre'],
        'receptorId'        => (int)$r['id_receptor'],
        'receptorNombre'    => $r['receptor_nombre'],
        'prospectoNombre'   => $r['prospecto_nombre'],
        'prospectoEmpresa'  => $r['prospecto_empresa'],
        'prospectoTelefono' => $r['prospecto_telefono'],
        'prospectoEmail'    => $r['prospecto_email'],
        'giroRequerido'     => $r['giro_requerido'],
        'necesidad'         => $r['necesidad'],
        'esUrgente'         => (bool)$r['es_urgente'],
        'estado'            => $r['estado'],
        'fechaRegistro'     => $r['fecha_registro'],
    ];
}

/** Texto opcional: recorta, convierte '' en null y valida longitud máxima. */
function netx_texto(array $body, string $campo, int $max, array &$errores): ?string
{
    $v = trim((string)($body[$campo] ?? ''));
    if ($v === '') {
        return null;
    }
    if (mb_strlen($v) > $max) {
        $errores[$campo] = "Máximo $max caracteres.";
    }
    return $v;
}

$user = netx_require_login();

switch ($_SERVER['REQUEST_METHOD']) {

    // ------------------------------------------------------------------
    // GET: listar referidos (con filtros opcionales)
    // ------------------------------------------------------------------
    case 'GET':
        $where  = [];
        $params = [];

        foreach (['receptor' => 'r.id_receptor', 'generador' => 'r.id_generador'] as $param => $col) {
            if (isset($_GET[$param]) && $_GET[$param] !== '') {
                $id = filter_var($_GET[$param], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
                if ($id === false) {
                    json_out(['success' => false, 'message' => "El filtro '$param' debe ser un ID numérico."], 422);
                }
                $where[]        = "$col = :$param";
                $params[$param] = $id;
            }
        }
        if (isset($_GET['estado']) && $_GET['estado'] !== '') {
            if (!in_array($_GET['estado'], NETX_ESTADOS_REFERIDO, true)) {
                json_out(['success' => false, 'message' => 'Estado no válido.', 'estadosValidos' => NETX_ESTADOS_REFERIDO], 422);
            }
            $where[]          = 'r.estado = :estado';
            $params['estado'] = $_GET['estado'];
        }

        $sql = NETX_SQL_REFERIDOS
             . ($where ? ' WHERE ' . implode(' AND ', $where) : '')
             . ' ORDER BY r.fecha_registro DESC, r.id DESC';
        $st = netx_db()->prepare($sql);
        $st->execute($params);

        json_out(['success' => true, 'referidos' => array_map('netx_referido_json', $st->fetchAll())]);

    // ------------------------------------------------------------------
    // POST: registrar referido (HU-18) con candado de duplicados (HU-19)
    // ------------------------------------------------------------------
    case 'POST':
        if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') === false) {
            json_out(['success' => false, 'message' => 'Se esperaba application/json.'], 415);
        }
        $body = json_decode(file_get_contents('php://input') ?: '', true);
        if (!is_array($body)) {
            json_out(['success' => false, 'message' => 'JSON inválido.'], 400);
        }

        // El generador es el miembro dueño de la sesión.
        $idGenerador = $user['idMiembro'] ?? null;
        if (!$idGenerador) {
            json_out(['success' => false, 'message' => 'Tu usuario no tiene ficha de miembro; no puede generar referidos.'], 403);
        }

        // 1. Campos obligatorios y formato
        $errores    = [];
        $idReceptor = filter_var($body['receptorId'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        if ($idReceptor === false) {
            $errores['receptorId'] = 'Selecciona el miembro receptor.';
        }
        $prospecto = netx_texto($body, 'prospectoNombre', 150, $errores);
        $empresa   = netx_texto($body, 'prospectoEmpresa', 150, $errores);
        $necesidad = netx_texto($body, 'necesidad', 500, $errores);
        $telefono  = netx_texto($body, 'prospectoTelefono', 20, $errores);
        $email     = netx_texto($body, 'prospectoEmail', 150, $errores);
        $giro      = netx_texto($body, 'giroRequerido', 100, $errores);
        $urgente   = filter_var($body['esUrgente'] ?? false, FILTER_VALIDATE_BOOLEAN);

        if ($prospecto === null) { $errores['prospectoNombre']  = 'El nombre del prospecto es obligatorio.'; }
        if ($empresa === null)   { $errores['prospectoEmpresa'] = 'La empresa del prospecto es obligatoria.'; }
        if ($necesidad === null) { $errores['necesidad']        = 'Describe la necesidad del prospecto.'; }
        if ($email !== null && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errores['prospectoEmail'] = 'Correo del prospecto no válido.';
        }
        if ($idReceptor !== false && (int)$idReceptor === (int)$idGenerador) {
            $errores['receptorId'] = 'No puedes referirte un prospecto a ti mismo.';
        }
        if ($errores) {
            json_out(['success' => false, 'message' => 'Revisa los datos del referido.', 'errores' => $errores], 422);
        }

        $pdo = netx_db();
        $pdo->beginTransaction();
        try {
            // 2. Generador y receptor deben ser miembros activos.
            //    FOR UPDATE bloquea la fila del receptor: dos altas simultáneas hacia el mismo
            //    receptor se atienden en fila y el candado de duplicados no se puede saltar.
            $st = $pdo->prepare(
                'SELECT id_miembro, activo FROM miembros WHERE id_miembro IN (?, ?) ORDER BY id_miembro FOR UPDATE'
            );
            $st->execute([$idGenerador, $idReceptor]);
            $activos = [];
            foreach ($st->fetchAll() as $m) {
                $activos[(int)$m['id_miembro']] = (bool)$m['activo'];
            }
            if (empty($activos[(int)$idGenerador])) {
                $pdo->rollBack();
                json_out(['success' => false, 'message' => 'Tu ficha de miembro no está activa.'], 403);
            }
            if (empty($activos[(int)$idReceptor])) {
                $pdo->rollBack();
                json_out(['success' => false, 'message' => 'El receptor no existe o no es un miembro activo.',
                          'errores' => ['receptorId' => 'Miembro no activo.']], 422);
            }

            // 3. Candado de duplicados (HU-19): mismo receptor + mismo prospecto (nombre O empresa)
            //    en un estado activo. La collation *_ci hace la comparación sin distinguir mayúsculas.
            $marcas = implode(',', array_fill(0, count(NETX_ESTADOS_ACTIVOS), '?'));
            $st = $pdo->prepare(
                "SELECT id, prospecto_nombre, prospecto_empresa, estado
                   FROM referidos
                  WHERE id_receptor = ?
                    AND estado IN ($marcas)
                    AND (prospecto_nombre = ? OR prospecto_empresa = ?)
                  LIMIT 1"
            );
            $st->execute([$idReceptor, ...NETX_ESTADOS_ACTIVOS, $prospecto, $empresa]);
            if ($dup = $st->fetch()) {
                $pdo->rollBack();
                json_out([
                    'success'    => false,
                    'message'    => sprintf(
                        'El prospecto "%s (%s)" ya está activo con este receptor en estado "%s". No se puede registrar de nuevo.',
                        $dup['prospecto_nombre'], $dup['prospecto_empresa'], $dup['estado']
                    ),
                    'duplicadoId' => (int)$dup['id'],
                ], 409);
            }

            // 4. Guardar
            $pdo->prepare(
                'INSERT INTO referidos
                    (id_generador, id_receptor, prospecto_nombre, prospecto_empresa, prospecto_telefono,
                     prospecto_email, giro_requerido, necesidad, es_urgente)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            )->execute([$idGenerador, $idReceptor, $prospecto, $empresa, $telefono,
                        $email, $giro, $necesidad, $urgente ? 1 : 0]);
            $id = (int)$pdo->lastInsertId();
            $pdo->commit();
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;   // lo atiende el manejador de _bootstrap.php (500)
        }

        $st = netx_db()->prepare(NETX_SQL_REFERIDOS . ' WHERE r.id = ?');
        $st->execute([$id]);
        json_out(['success' => true, 'message' => 'Referido registrado.', 'referido' => netx_referido_json($st->fetch())], 201);

    default:
        header('Allow: GET, POST');
        json_out(['success' => false, 'message' => 'Método no permitido.'], 405);
}
