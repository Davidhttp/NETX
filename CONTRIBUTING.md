# Manual de Contribución y Estándar Técnico — Proyecto NETX

¡Bienvenido al repositorio de NETX! Para mantener la calidad, legibilidad y estabilidad del software a lo largo del desarrollo, todos los integrantes del equipo deben apegarse a las siguientes normas:

## 1. Flujo de Ramas (Branching Model)
1. Queda estrictamente **prohibido** realizar commits o `push` directo sobre la rama `main`.
2. Toda nueva funcionalidad debe desarrollarse en una rama propia derivada de `main`, nombrada bajo el formato:
   ```text
   feature/HU-[ID]-[nombre-corto-en-kebab-case]
   ```
   Ejemplo: `feature/HU-01-login-correo`
3. Para corrección de errores durante revisiones o QA, utilizar:
   ```text
   fix/[descripcion-del-bug]
   ```
   Ejemplo: `fix/error-validacion-categoria-duplicada`

## 2. Convención de Mensajes de Commit (Conventional Commits)
Los mensajes deben redactarse en español, en tiempo presente e imperativo, siguiendo la estructura:
```text
tipo(alcance): descripción breve y concisa [#HU-XX]
```

Tipos admitidos:
- `feat`: Nueva característica para el usuario
- `fix`: Corrección de un bug en código existente
- `docs`: Modificaciones en documentación o comentarios
- `style`: Formateo, punto y coma, indentación (sin impacto en lógica)
- `refactor`: Refactorización de código sin alterar comportamiento
- `test`: Adición o corrección de pruebas
- `chore`: Tareas de mantenimiento en configuración o repositorio

Ejemplo:
```text
feat(membresia): validar unicidad de giro comercial en BD [#HU-07]
```

## 3. Proceso de Pull Request (PR) y Code Review
1. Al concluir una tarea técnica o historia, el desarrollador creará un Pull Request apuntando hacia la rama `main`.
2. El título del PR debe indicar la Historia de Usuario asociada (ej. `[HU-01] Implementación de Login y Control de Sesión`).
3. La descripción debe detallar:
   - Resumen conciso de cambios introducidos.
   - Pasos manuales para probar la funcionalidad localmente.
   - Captura de pantalla o evidencia de ejecución exitosa.
4. Es **obligatorio** que al menos un compañero de equipo revise y apruebe formalmente el PR.
5. El merge será realizado por el Scrum Master o el autor tras obtener el visto bueno.

## 4. Estándares de Codificación
- **HTML:** Semántico, uso estricto de etiquetas `<form>`, `<input>` con `<label>` asociados y atributos de accesibilidad.
- **CSS:** Uso preferente de clases de Bootstrap 5; estilos personalizados dentro de `frontend/assets/css/styles.css` y `variables.css` utilizando variables CSS para colores corporativos.
- **JS:** ES6+, nombres de variables y funciones en `camelCase` descriptivo, sin dependencias externas innecesarias.
- **PHP:** PHP 8.2+, uso de PDO con sentencias preparadas, manejo explícito de códigos HTTP y respuestas JSON uniformes.
- **SQL (MySQL/MariaDB):** Palabras clave en MAYÚSCULAS (`SELECT`, `INSERT`, `UPDATE`), nombres de tablas en plural minúsculas (`miembros`, `reuniones`) y llaves foráneas con prefijo `id_`.