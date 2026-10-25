/* NETX · main.js — comportamiento común del layout */
(() => {
  'use strict';

  const CLAVE_SIDEBAR = 'netx.sidebarColapsado';

  const leerPreferencia = () => {
    try { return localStorage.getItem(CLAVE_SIDEBAR) === '1'; }
    catch { return false; }
  };

  const guardarPreferencia = (valor) => {
    try { localStorage.setItem(CLAVE_SIDEBAR, valor ? '1' : '0'); }
    catch { /* almacenamiento no disponible: se ignora */ }
  };

  const aplicarColapso = (colapsado) => {
    const boton = document.getElementById('btnColapsar');
    document.body.classList.toggle('sidebar-collapsed', colapsado);
    if (boton) {
      boton.setAttribute('aria-expanded', String(!colapsado));
      boton.setAttribute('aria-label', colapsado ? 'Expandir menú lateral' : 'Contraer menú lateral');
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Sidebar colapsable (escritorio)
    aplicarColapso(leerPreferencia());
    const boton = document.getElementById('btnColapsar');
    if (boton) {
      boton.addEventListener('click', () => {
        const colapsar = !document.body.classList.contains('sidebar-collapsed');
        aplicarColapso(colapsar);
        guardarPreferencia(colapsar);
      });
    }

    // Año del pie de página
    const anio = document.getElementById('anio');
    if (anio) anio.textContent = new Date().getFullYear();

    // Los datos reales de usuario y rol llegarán con HU-01 (login).
    // Ejemplo de uso futuro:
    // document.getElementById('nombreUsuario').textContent = sesion.nombre;
  });
})();