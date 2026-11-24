# Bitácora de Seguimiento y Cierre — Sprint 2

**Instituto Tecnológico de Morelia**  
**Tecnológico Nacional de México (TecNM)** · Departamento de Sistemas y Computación · Ingeniería de Software  

**Proyecto:** NETX — Plataforma de Gestión de Networking Empresarial  
**Periodo Planificado del Sprint 2:** 26 de octubre al 8 de noviembre de 2026 (Semanas 5–6)  
**Docente Titular:** Dr. Claudio Ernesto Florián Arenas  

**Equipo Scrum:**
- **David Heredia Tapia** — Scrum Master
- **Diego Uriel Méndez Rodríguez** — Product Owner
- **Alberto Montoya Arriaga** — Developer (Backend & BD)
- **Brayan Ramiro Reyes Cárdenas** — Developer (Frontend & UI)

---

## 1. Meta del Sprint 2 (Sprint Goal)
> "Completar el seguimiento de origen de miembros (`HU-10`) y entregar operativo el Módulo 3 de Reuniones Semanales (`HU-11` a `HU-17`): programación de reuniones con agenda, invitados y capacitación, pase de lista móvil con doble confirmación administrativa, registro de suplentes, cronómetro de pitch de 2 minutos y rotación de 2 presentaciones centrales de 10 minutos."

**Alcance Comprometido:** 8 Historias de Usuario (**43 Story Points**).

---

## 2. Estado del Sprint Backlog (Realidad Técnica vs. Planeación)

| ID | Historia de Usuario | Mód. | Pts | Issue | Estado Frontend / Local (`feature/diego-sprint1-2`) | Estado BD MySQL + API PHP | Estado Final Sprint 2 |
|---|---|---|---|---|---|---|---|
| **HU-10** | Registrar quién originó la incorporación del nuevo miembro | M2 | 5 | #10 | Implementado (`id_referido_por`, selector y conteo de meta anual en `frontend/miembros.html`) | Pendiente endpoint PHP de miembros | **En validación** |
| **HU-11** | Crear reunión con fecha, hora, sede y orden del día | M3 | 5 | #11 | Implementado (`#modalNuevaReunion`, selector dinámico `#selectReunionActiva` en `frontend/reuniones.html`) | Pendiente tabla `reuniones` y API | **En validación** |
| **HU-12** | Registrar invitados y capacitación por reunión | M3 | 5 | #12 | Implementado (`#modalAgregarInvitado` y `#modalEditarCapacitacion` por reunión) | Pendiente tablas `invitados` / `capacitaciones` y API | **En validación** |
| **HU-13** | Marcar asistencia desde el celular | M3 | 8 | #13 | Implementado en pestaña móvil vinculado a `reunionActivaId` | Pendiente tabla `asistencias` y API | **En validación** |
| **HU-14** | Confirmar o rechazar asistencia (admin) | M3 | 5 | #14 | Implementado en tabla de doble confirmación (umbral `> inasistenciasPermitidas`) | Pendiente tabla `asistencias` y API | **En validación** |
| **HU-15** | Registrar suplentes y cronometrar pitch de 2 minutos | M3 | 5 | #15/#16 | Implementado (`#modalRegistrarSuplente`, cronómetro y lista de pitches en vivo por reunión) | Pendiente tablas `asistencias`/`pitches` y API | **En validación** |
| **HU-16** | Programar 2 presentaciones centrales de 10 min por rotación | M3 | 5 | #17 | Implementado (`generarRotacionPonentes` en `store.js` y `reuniones.html`) | Pendiente tabla `presentaciones` y API | **En validación** |
| **HU-17** | Historial y reprogramación de presentaciones | M3 | 5 | #17 | Implementado (`#modalReprogramarPonente`, marcado ejecutada e historial dinámico) | Pendiente tabla `presentaciones` y API | **En validación** |

> **Nota de trazabilidad GitHub:** En los issues abiertos de GitHub, `#15` corresponde a *Registrar suplentes*, `#16` a *Cronometrar pitch de 2 minutos* y `#17` a *Programar 2 presentaciones de 10 min*, mientras que en la Planeación v1.1 `HU-15` es *Cronómetro de pitch*, `HU-16` es *Programar 2 presentaciones* y `HU-17` es *Historial y reprogramación*.

---

## 3. Checklist de Pruebas de Aceptación del Product Owner (`tests/acceptance/matriz_pruebas_mvp.md`)

- [ ] **`CP-06` (`HU-10`):** Al registrar un nuevo miembro seleccionando un socio originador (`id_referido_por`), se persiste la relación y se incrementa el conteo de meta anual en el padrón.
- [ ] **`CP-07` (`HU-11`):** Al programar una reunión en `#modalNuevaReunion`, aparece en el selector de sesiones y permite operar sus pestañas de forma independiente.
- [ ] **`CP-08` (`HU-12`):** Los invitados externos y el tema/ponente de capacitación se guardan por reunión seleccionada.
- [ ] **`CP-09` (`HU-13` / `HU-14` / `HU-15`):** El socio marca asistencia o registra suplente desde móvil en estado `Pendiente` y el administrador confirma o rechaza en la tabla en tiempo real.
- [ ] **`CP-10` (`HU-15` / `RF-06`):** El cronómetro lee `duracionPitchSegundos`, muestra alertas (`< 30 s` ámbar, `00:00` rojo), guarda el pitch en la reunión activa y avanza al siguiente socio.
- [ ] **`CP-11` (`HU-16` / `HU-17`):** La rotación asigna 2 ponentes activos priorizando menor historial, permite reprogramar tema/ponente y registra las ponencias ejecutadas en el historial anual.

---

## 4. Verificación contra Definition of Done (DoD)

- [ ] Código de M2 (`HU-10`) y M3 (`HU-11` a `HU-17`) integrado en `main` mediante Pull Request revisado y sin conflictos.
- [ ] Persistencia real en **MySQL** (`database/NETX_DB.sql`) y endpoints PHP conectados sin depender únicamente de `localStorage`.
- [ ] Pruebas de aceptación (`CP-06` a `CP-11`) superadas al 100% en entorno local homologado.
- [ ] Documentación técnica y matriz de pruebas actualizadas en `docs/` y `tests/`.
- [ ] Aprobación formal del Product Owner y cierre de tarjetas en GitHub Projects.

---

## 5. Declaración de Conformidad (Cierre del Sprint 2)

| Integrante | Rol Scrum | Entregables Auditados | Estatus |
|---|---|---|---|
| **David Heredia Tapia** | Scrum Master | Gobernanza de ramas, PRs, documentación y coordinación de integración | En validación (pendiente merge a `main`) |
| **Diego Uriel Méndez Rodríguez** | Product Owner | Validación funcional Gherkin (`CP-06` a `CP-11`) y aceptación DoD | Pendiente de integración BD-API |
| **Alberto Montoya Arriaga** | Developer (BD/BE) | Tablas MySQL de M3 y endpoints REST en PHP/PDO | Pendiente de entrega en repo |
| **Brayan Ramiro Reyes Cárdenas** | Developer (FE/UI) | Vistas `miembros.html` y `reuniones.html` conectadas a la API | Pendiente de conexión con API |

**Vo. Bo. Docente Titular:** Dr. Claudio Ernesto Florián Arenas — *Morelia, Michoacán, México*