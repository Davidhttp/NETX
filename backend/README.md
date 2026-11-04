# Manual para backend

1. Copia y pega el archivo [.env.example](../.env.example) cambiando los campos de `DB_USER` y `DB_PASS` con las credenciales de tu usuario administrador de MySQL. Si usas MySQL en otro puerto cambiar `DB_PORT`. Una vez hecho los cambios, renombra el archivo a `.env`.
2. Para ejecutar el [script de la BD](../database/NETX_DB.sql), **abre una terminal de CMD** en el directorio raíz del proyecto y ejecuta el siguiente comando: ```bash mysql -u root -p < database\NETX_DB.sql```. También, para cargar los usuarios de muestra, ejecuta: ```bash php backend\scripts\seed_users.php```.
3. Finalmente, para correr toda la aplicación web, en una terminal en la raíz del proyecto ejecuta: ```bash php -S localhost:8000 router.php```.
4. Para navegar por la aplicación, abre el navegador y escribe en la url: `http://localhost:8000/frontend/index.html`.

> OJO: No es necesario correr el LiveServer para acceder a cada una de las vistas, con ejecutar el servidor de PHP basta.
