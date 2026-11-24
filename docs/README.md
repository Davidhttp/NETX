# Documentación Técnica — NETX

**NETX** es una plataforma web para la gestión integral de capítulos de networking empresarial (membresías con exclusividad de giro comercial, reuniones semanales, asistencia con doble confirmación, cronómetro de pitch, presentaciones centrales e intercambio de referidos).

---

## 1. Estándar de Colaboración y Git (T-04)
Consulta el manual completo de ramas, Conventional Commits, Pull Requests y estilo de código en [CONTRIBUTING.md](../CONTRIBUTING.md).

---

## 2. Stack Tecnológico y Configuración Local (T-06)

> **Nota técnica sobre el motor de BD:** Aunque las tareas iniciales del backlog (`T-05` / `T-06`) mencionaban SQL Server, la arquitectura aprobada del proyecto (Planeación v1.1) estandarizó el entorno sobre **MySQL 8.0 / MariaDB 10.6+ (InnoDB)** con **PHP 8.2+ (PDO)** para garantizar compatibilidad en entornos locales (XAMPP/WAMP/Laragon) y despliegue web.

### Requisitos Previos
- PHP 8.2+ (con extensión `pdo_mysql` habilitada)
- MySQL 8.0+ o MariaDB 10.6+
- Git 2.40+

### Pasos de Instalación Local
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Davidhttp/NETX.git
   cd NETX
   ```
2. **Crear la base de datos e importar el esquema:**
   ```bash
   mysql -u root -p -e "CREATE DATABASE netx_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   mysql -u root -p netx_db < database/NETX_DB.sql
   ```
3. **Configurar variables de entorno:**
   - Copiar `.env.example` a `.env` en la raíz del proyecto y ajustar `DB_HOST`, `DB_NAME`, `DB_USER` y `DB_PASS`.
   - Opcionalmente poblar los usuarios iniciales si existe `backend/scripts/seed_users.php`:
     ```bash
     php backend/scripts/seed_users.php
     ```
4. **Levantar el servidor local de desarrollo:**
   ```bash
   php -S localhost:8000 router.php
   ```
   Abrir en el navegador: `http://localhost:8000/frontend/login.html`.

---

## 3. Alcance MVP Comprometido (20 HUs / 91 Story Points)

| Sprint | Módulos | Historias de Usuario |
|---|---|---|
| **Sprint 1** | M1 Acceso y Reglas · M2 Membresía Base | `HU-01` a `HU-09` (32 pts) |
| **Sprint 2** | M2 Crecimiento · M3 Reuniones y Operación | `HU-10` a `HU-17` (43 pts) |
| **Sprint 3** | M4 Referidos Base | `HU-18` y `HU-19` (8 pts) |
| **Sprint 4** | M6 Dashboard Base · QA y Release | `HU-28` (8 pts) |

---

## 4. Bitácoras de Sprint
- [Bitácora de Seguimiento y Cierre — Sprint 2](bitacoras/bitacora_sprint_2.md)
- [Bitácora de Seguimiento y Cierre — Sprint 3](bitacoras/bitacora_sprint_3.md)

---

## 5. Pruebas de Aceptación
La matriz de trazabilidad **RF → HU → Casos de Prueba Gherkin** se encuentra en [tests/acceptance/matriz_pruebas_mvp.md](../tests/acceptance/matriz_pruebas_mvp.md).