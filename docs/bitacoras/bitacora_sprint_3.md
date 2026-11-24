# Bitácora de Seguimiento y Cierre — Sprint 3

**Instituto Tecnológico de Morelia**  
**Tecnológico Nacional de México (TecNM)** · Departamento de Sistemas y Computación · Ingeniería de Software  

**Proyecto:** NETX — Plataforma de Gestión de Networking Empresarial  
**Periodo Planificado del Sprint 3:** 9 al 22 de noviembre de 2026 (Semanas 7–8)  
**Docente Titular:** Dr. Claudio Ernesto Florián Arenas  

**Equipo Scrum:**
- **David Heredia Tapia** — Scrum Master
- **Diego Uriel Méndez Rodríguez** — Product Owner
- **Alberto Montoya Arriaga** — Developer (Backend & BD)
- **Brayan Ramiro Reyes Cárdenas** — Developer (Frontend & UI)

---

## 1. Meta del Sprint 3 (Sprint Goal)
> "Habilitar la emisión e intercambio estructurado de referidos entre socios con persistencia en MySQL (`HU-18`), garantizando el bloqueo automático en tiempo real de prospectos activos duplicados hacia un mismo receptor (`HU-19`)."

**Alcance Comprometido en MVP:** 2 Historias de Usuario (**8 Story Points**).  
*(Nota: `HU-20`, `HU-21` y `HU-22` corresponden a Evolución Futura fuera del corte MVP del 11 de diciembre).*

---

## 2. Sprint Backlog (M4 Base — 8 Story Points)

| ID | Historia de Usuario | Mód. | Pts | Requisito ERS / Regla | Estado en GitHub | Estado Técnico Actual |
|---|---|---|---|---|---|---|
| **HU-18** | Registro e intercambio de referidos | M4 | 5 | `RF-08` / `RN-REF-01` | Abierto ([#28](https://github.com/Davidhttp/NETX/issues/28)) | UI maquetada en `frontend/referidos.html` (`localStorage`); pendiente tabla MySQL `referidos` y API PHP `GET/POST` |
| **HU-19** | Bloqueo de prospectos activos duplicados | M4 | 3 | `RF-09` / `RN-REF-02` | Abierto ([#29](https://github.com/Davidhttp/NETX/issues/29)) | Validación cliente en `store.js`; pendiente validación transaccional en PHP retornando HTTP `409 Conflict` |

---

## 3. Desglose Operativo por Rol (Sprint 3)

### Alberto Montoya Arriaga (Backend & Base de Datos)
- [ ] Agregar tabla `referidos` en `database/NETX_DB.sql` (`id_generador`, `id_receptor`, datos del prospecto, `giro_requerido`, `necesidad`, `es_urgente`, `estado`, `fecha_registro`) e índice en `(id_receptor, estado)`.
- [ ] Crear `GET /backend/api/referrals.php` para listar referidos reales desde MySQL.
- [ ] Crear `POST /backend/api/referrals.php` validando sesión, miembros activos y bloqueando con **HTTP 409** cualquier prospecto activo duplicado para el mismo `id_receptor` (`HU-19`).

### Brayan Ramiro Reyes Cárdenas (Frontend & UI)
- [ ] Conectar `frontend/referidos.html` a `GET/POST backend/api/referrals.php` en lugar de `localStorage`.
- [ ] Mostrar alerta visual clara cuando el backend devuelva HTTP `409` por duplicidad (`HU-19`).

### David Heredia Tapia (Scrum Master) & Diego Uriel Méndez Rodríguez (Product Owner)
- [x] Dar de alta los issues **`HU-18`** ([#28](https://github.com/Davidhttp/NETX/issues/28)) y **`HU-19`** ([#29](https://github.com/Davidhttp/NETX/issues/29)) en `Davidhttp/NETX` con etiquetas `mod:m4-referidos`, `type:hu`, `alta`.
- [ ] Ejecutar en vivo las pruebas de aceptación `CP-12` y `CP-13` contra MySQL.
- [ ] Revisar/aprobar el Pull Request hacia `main` y mover ambas tarjetas a `Done`.

---

## 4. Checklist de Pruebas de Aceptación (`tests/acceptance/matriz_pruebas_mvp.md`)

- [ ] **`CP-12` (`HU-18` / `RF-08`):** Al registrar un referido entre dos socios activos con prospecto, empresa y necesidad comercial, se guarda en MySQL con estado `'Referido'` y persiste tras recargar el navegador.
- [ ] **`CP-13` (`HU-19` / `RF-09`):** Al intentar registrar nuevamente un prospecto que ya está activo (`Referido`, `Contacto`, `Reunión 1-a-1`, `Oportunidad` o `Cotización`) para el mismo receptor, el backend responde HTTP `409` y el frontend bloquea el alta mostrando el motivo.

---

## 5. Verificación contra Definition of Done (DoD)

- [ ] Código de `HU-18` y `HU-19` integrado en `main` mediante Pull Request aprobado y sin conflictos.
- [ ] Pruebas `CP-12` y `CP-13` validadas al 100% contra base de datos MySQL real.
- [ ] Issues `HU-18` y `HU-19` creados, vinculados al PR y cerrados en GitHub Projects.
- [ ] Aceptación formal firmada por el Product Owner.

---

## 6. Declaración de Conformidad (Cierre del Sprint 3)

| Integrante | Rol Scrum | Entregables Auditados | Estatus |
|---|---|---|---|
| **David Heredia Tapia** | Scrum Master | Control de PRs, ramas y cierre de tablero en GitHub Projects | Pendiente de implementación BD/API y PR |
| **Diego Uriel Méndez Rodríguez** | Product Owner | Definición Gherkin (`CP-12`, `CP-13`) y validación funcional en vivo | Pendiente de implementación BD/API |
| **Alberto Montoya Arriaga** | Developer (BD/BE) | Tabla `referidos` en MySQL y endpoint `backend/api/referrals.php` | Pendiente |
| **Brayan Ramiro Reyes Cárdenas** | Developer (FE/UI) | Conexión de `frontend/referidos.html` con API PHP y manejo de error `409` | Pendiente |

**Vo. Bo. Docente Titular:** Dr. Claudio Ernesto Florián Arenas — *Morelia, Michoacán, México*