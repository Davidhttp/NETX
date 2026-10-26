/**
 * Componente <netx-sidebar>
 *
 * Atributo opcional:
 *   active  Clave del ítem activo: panel | miembros | reglas | reuniones | referidos
 *
 * Ejemplo:
 *   <netx-sidebar active="miembros"></netx-sidebar>
 *
 * Para agregar una opción de menú basta con añadirla al arreglo MENU.
 * Un elemento con la propiedad "grupo" dibuja un encabezado de sección.
 *
 * Estilos: assets/css/components/sidebar.css
 */
(() => {
  'use strict';

  const MENU = [
    { clave: 'panel',     texto: 'Panel',               icono: 'bi-speedometer2',     href: 'index.html' },
    { grupo: 'Capítulo' },
    { clave: 'miembros',  texto: 'Miembros',            icono: 'bi-people',           href: '#miembros' },
    { clave: 'reglas',    texto: 'Reglas del capítulo', icono: 'bi-sliders',          href: '#reglas' },
    { grupo: 'Operación semanal' },
    { clave: 'reuniones', texto: 'Reuniones',           icono: 'bi-calendar-event',   href: '#reuniones' },
    { clave: 'referidos', texto: 'Referidos',           icono: 'bi-arrow-left-right', href: '#referidos' },
  ];

  const esc = (texto) => {
    const nodo = document.createElement('div');
    nodo.textContent = texto;
    return nodo.innerHTML.replace(/"/g, '&quot;');
  };

  class NetxSidebar extends HTMLElement {
    connectedCallback() {
      const activa = this.getAttribute('active') || 'panel';

      const items = MENU.map((item) => {
        if (item.grupo) {
          return `<li class="nav-group nav-text">${esc(item.grupo)}</li>`;
        }
        const esActivo = item.clave === activa;
        return `
          <li class="nav-item">
            <a class="nav-link${esActivo ? ' active' : ''}" href="${esc(item.href)}"${esActivo ? ' aria-current="page"' : ''}>
              <i class="bi ${esc(item.icono)}"></i>
              <span class="nav-text">${esc(item.texto)}</span>
            </a>
          </li>`;
      }).join('');

      this.innerHTML = `
        <aside class="app-sidebar offcanvas-lg offcanvas-start" tabindex="-1" id="sidebar"
               aria-label="Navegación principal">
          <div class="offcanvas-header d-lg-none">
            <span class="brand text-dark"><span class="brand-mark" aria-hidden="true">N</span>NETX</span>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"
                    data-bs-target="#sidebar" aria-label="Cerrar menú"></button>
          </div>
          <nav class="offcanvas-body flex-column p-0">
            <ul class="nav flex-column side-nav">${items}</ul>
          </nav>
        </aside>`;
    }
  }

  customElements.define('netx-sidebar', NetxSidebar);
})();