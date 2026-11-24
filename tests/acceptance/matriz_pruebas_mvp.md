# Matriz de Trazabilidad y Casos de Prueba de Aceptación (MVP)

Este documento mapea los Requisitos Funcionales (`RF-01` a `RF-12`) con las Historias de Usuario comprometidas para el MVP (`91 Story Points`) y define los escenarios de verificación bajo formato Gherkin (`Dado / Cuando / Entonces`).

---

## 1. Matriz de Trazabilidad RF → HU → Sprint

| RF | Requisito Funcional | HUs Asociadas | Sprint | Estatus en MVP |
|---|---|---|---|---|
| **RF-01** | Control de acceso y roles | `HU-01`, `HU-02` | Sprint 1 | Incluido (100%) |
| **RF-02** | Configuración de reglas del capítulo | `HU-03`, `HU-04`, `HU-05` | Sprint 1 | Incluido (100%) |
| **RF-03** | Gestión de miembros, categorías y crecimiento | `HU-06`, `HU-07`, `HU-08`, `HU-09`, `HU-10` | Sprint 1 y 2 | Incluido (100%) |
| **RF-04** | Gestión de reuniones, invitados y capacitación | `HU-11`, `HU-12` | Sprint 2 | Incluido (100%) |
| **RF-05** | Registro de asistencia y suplencia | `HU-13`, `HU-14` | Sprint 2 | Incluido (100%) |
| **RF-06** | Control del pitch semanal | `HU-15` | Sprint 2 | Incluido (100%) |
| **RF-07** | Programación de presentaciones centrales | `HU-16`, `HU-17` | Sprint 2 | Incluido (100%) |
| **RF-08** | Registro y cuota mínima de referidos | `HU-18` (MVP) · `HU-22` (Diferido) | Sprint 3 | Parcial (Emisión base) |
| **RF-09** | Seguimiento del embudo y negocio ganado | `HU-19` (MVP) · `HU-20`, `HU-21` (Diferido) | Sprint 3 | Parcial (Bloqueo duplicados) |
| **RF-10** | Administración básica de cuotas y pagos | `HU-23`, `HU-24`, `HU-25` | Diferido | Evolución Futura |
| **RF-11** | Gestión de incumplimientos y sanciones | `HU-26`, `HU-27` | Diferido | Evolución Futura |
| **RF-12** | Indicadores, notificaciones y auditoría | `HU-28` (MVP) · `HU-29`, `HU-30` (Diferido) | Sprint 4 | Parcial (Dashboard mando) |

---

## 2. Casos de Prueba de Aceptación (Gherkin)

### Sprint 1 — Acceso, Reglas y Membresía Base

- **CP-01 (`HU-01` / `RF-01`) — Inicio de sesión exitoso por rol**
  - **Dado** un usuario registrado con estatus `Activo` y contraseña válida en MySQL,
  - **Cuando** envía su correo y contraseña desde `frontend/login.html` a `backend/api/login.php`,
  - **Entonces** el backend regenera el ID de sesión, retorna sus datos y rol (`Administrador`, `Coordinador` o `Miembro`) y lo redirige a `frontend/index.html`.

- **CP-02 (`HU-02` / `RF-01`) — Rechazo de credenciales inválidas o usuario inactivo**
  - **Dado** un intento de acceso con contraseña incorrecta, correo inexistente o usuario en `Baja`,
  - **Cuando** se envía el formulario de login,
  - **Entonces** el sistema responde HTTP `401`/`403` con un mensaje de error genérico sin filtrar si falló el correo o la contraseña.

- **CP-03 (`HU-03`, `HU-04`, `HU-05` / `RF-02`) — Configuración paramétrica de reglas**
  - **Dado** un `Administrador` autenticado en la vista de Reglas del Capítulo,
  - **Cuando** actualiza la cuota semanal mínima de referidos (`>= 1`), el tope de inasistencias sin suplente (`>= 0`) y los tiempos de pitch (`120 s`) y ponencias (`10 min`),
  - **Entonces** los valores se guardan y las vistas de reuniones y miembros consumen esos umbrales dinámicamente (marcando infracción solo cuando `faltasSinSuplente > inasistenciasPermitidas`).

- **CP-04 (`HU-06`, `HU-07` / `RF-03`) — Alta de miembro y exclusividad de giro**
  - **Dado** que existe un miembro con estatus `Activo` en el giro `"Marketing y Publicidad"`,
  - **Cuando** el administrador intenta registrar otro miembro `Activo` con el mismo giro,
  - **Entonces** el sistema bloquea el registro y muestra la alerta de conflicto de exclusividad.

- **CP-05 (`HU-08`, `HU-09` / `RF-03`) — Edición y baja definitiva con liberación de giro**
  - **Dado** un miembro `Activo` en el padrón,
  - **Cuando** el administrador edita su teléfono/empresa o cambia su estatus a `Baja`,
  - **Entonces** la ficha refleja los cambios y, en caso de `Baja`, el giro comercial queda disponible inmediatamente para un nuevo candidato.

---

### Sprint 2 — Crecimiento y Operación de Reuniones

- **CP-06 (`HU-10` / `RF-03`) — Registro del socio originador y meta anual**
  - **Dado** un socio activo existente en el padrón,
  - **Cuando** se registra un nuevo miembro seleccionándolo como **Socio Originador** (`id_referido_por`),
  - **Entonces** el sistema persiste la relación y actualiza el conteo de ingresos anuales del originador (`1/1 Meta`).

- **CP-07 (`HU-11` / `RF-04`) — Programar nueva reunión semanal**
  - **Dado** un coordinador o administrador en `frontend/reuniones.html`,
  - **Cuando** abre el modal `Programar Reunión` y registra fecha, horario, sede y orden del día,
  - **Entonces** la nueva reunión aparece en el selector de sesiones y permite gestionar su operación sin depender de una sesión fija.

- **CP-08 (`HU-12` / `RF-04`) — Registro de invitados y tema/ponente de capacitación**
  - **Dado** una reunión seleccionada en `reuniones.html`,
  - **Cuando** se registra un visitante externo (con el socio que invita) y se captura el tema e instructor de la capacitación semanal,
  - **Entonces** la tarjeta de sesión y la pestaña `Orden del Día e Invitados` muestran la información actualizada.

- **CP-09 (`HU-13`, `HU-14`, `HU-15` / `RF-05`) — Asistencia móvil, suplente y doble confirmación**
  - **Dado** un miembro autenticado en la reunión activa,
  - **Cuando** marca su asistencia o registra un suplente con nombre, cargo y teléfono,
  - **Entonces** su marca queda en estado `Pendiente` hasta que el administrador la confirma o rechaza en la tabla de validación en tiempo real.

- **CP-10 (`HU-15` / `RF-06`) — Cronómetro de pitch de 2 minutos**
  - **Dado** un socio activo seleccionado en la pestaña `Cronómetro de Pitch`,
  - **Cuando** el coordinador inicia el conteo regresivo (configurado en reglas) y presiona `Registrar Pitch Completado`,
  - **Entonces** el sistema muestra alertas visuales (`< 30 s` ámbar, `00:00` rojo), guarda el tiempo usado en la reunión activa y avanza al siguiente socio.

- **CP-11 (`HU-16`, `HU-17` / `RF-07`) — Rotación, reprogramación e historial de presentaciones de 10 min**
  - **Dado** una reunión seleccionada en la pestaña `Presentaciones Estelares`,
  - **Cuando** se asignan 2 ponentes por rotación cíclica, se reprograma un ponente o se marca una ponencia como ejecutada,
  - **Entonces** el sistema evita repetir ponentes recientes, actualiza la tarjeta de la sesión y registra la ponencia en la tabla de historial anual.

---

### Sprint 3 — Referidos Base (`HU-18`, `HU-19`)

- **CP-12 (`HU-18` / `RF-08`) — Emisión de referido entre socios**
  - **Dado** un socio emisor y un socio receptor activos en `frontend/referidos.html`,
  - **Cuando** se captura prospecto, empresa, contacto y necesidad comercial,
  - **Entonces** el referido queda almacenado con fecha de registro y estado inicial `Referido`.

- **CP-13 (`HU-19` / `RF-09`) — Bloqueo de prospectos activos duplicados**
  - **Dado** un prospecto que ya se encuentra en estado activo (`Referido`, `Contacto`, `Reunión 1-a-1`, `Oportunidad` o `Cotización`) para un mismo receptor,
  - **Cuando** se intenta registrar nuevamente ese prospecto (por nombre o empresa) hacia el mismo receptor,
  - **Entonces** el sistema bloquea el alta (tanto en frontend como en backend MySQL) e informa del duplicado activo.

---

### Sprint 4 — Dashboard y Liberación (`HU-28`)

- **CP-14 (`HU-28` / `RF-12`) — Indicadores reales en Dashboard**
  - **Dado** datos reales almacenados en MySQL (miembros activos, reuniones realizadas, asistencias y referidos emitidos),
  - **Cuando** un usuario autenticado abre `frontend/index.html`,
  - **Entonces** las tarjetas y gráficas muestran métricas calculadas directamente de la base de datos sin valores inflados ni cifras fijas.