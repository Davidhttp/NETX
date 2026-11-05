/**
 * NETX · sidebar.js
 * Componente web <netx-sidebar>
 * Menú lateral y barra inferior móvil, filtrados según las páginas que el rol
 * del usuario puede abrir (window.NetxAuth, cargado por auth.js).
 */
(() => {
  'use strict';

  const MENU = [
    { clave: 'panel',     texto: 'Dashboard',            icono: 'bi-grid-fill',           href: 'index.html' },
    { grupo: 'Gobernanza' },
    { clave: 'miembros',  texto: 'Gestión de Miembros',  icono: 'bi-people-fill',         href: 'miembros.html' },
    { clave: 'reglas',    texto: 'Reglas del Capítulo',  icono: 'bi-sliders',             href: 'reglas.html' },
    { grupo: 'Operación Semanal' },
    { clave: 'reuniones', texto: 'Reuniones y Pitches',  icono: 'bi-calendar-event-fill', href: 'reuniones.html' },
    { clave: 'referidos', texto: 'Embudo de Referidos',  icono: 'bi-arrow-left-right',    href: 'referidos.html' },
    { grupo: 'Cuenta' },
    { clave: 'perfil',    texto: 'Mi Perfil',            icono: 'bi-person-circle',       href: 'perfil.html' },
  ];

  const BOTTOM_NAV = [
    { clave: 'panel',     texto: 'Dashboard', icono: 'bi-grid-fill',           href: 'index.html' },
    { clave: 'miembros',  texto: 'Miembros',  icono: 'bi-people-fill',         href: 'miembros.html' },
    { clave: 'reuniones', texto: 'Reuniones', icono: 'bi-calendar-event-fill', href: 'reuniones.html' },
    { clave: 'referidos', texto: 'Referidos', icono: 'bi-arrow-left-right',    href: 'referidos.html' },
    { clave: 'perfil',    texto: 'Perfil',    icono: 'bi-person-circle',       href: 'perfil.html' },
  ];

  const esc = (texto) => {
    const nodo = document.createElement('div');
    nodo.textContent = texto || '';
    return nodo.innerHTML.replace(/"/g, '&quot;');
  };

  class NetxSidebar extends HTMLElement {
    connectedCallback() {
      const activa  = this.getAttribute('active') || 'panel';
      const paginas = window.NetxAuth && window.NetxAuth.user && window.NetxAuth.user.paginas;
      const visible = (clave) => !paginas || paginas.includes(clave);

      // Agrupa por sección y descarta secciones sin ítems visibles para el rol
      const secciones = [];
      MENU.forEach((item) => {
        if (item.grupo) secciones.push({ grupo: item.grupo, items: [] });
        else {
          if (!secciones.length) secciones.push({ grupo: null, items: [] });
          if (visible(item.clave)) secciones[secciones.length - 1].items.push(item);
        }
      });

      const items = secciones.filter(s => s.items.length).map((s) => {
        const cab = s.grupo ? `<li class="nav-group nav-text">${esc(s.grupo)}</li>` : '';
        const lis = s.items.map((item) => {
          const esActivo = item.clave === activa;
          return `
          <li class="nav-item">
            <a class="nav-link${esActivo ? ' active' : ''}" href="${esc(item.href)}"${esActivo ? ' aria-current="page"' : ''} title="${esc(item.texto)}">
              <i class="bi ${esc(item.icono)}"></i>
              <span class="nav-text">${esc(item.texto)}</span>
            </a>
          </li>`;
        }).join('');
        return cab + lis;
      }).join('');

      const bottomItems = BOTTOM_NAV.filter(i => visible(i.clave)).map((item) => {
        const esActivo = item.clave === activa;
        return `
          <a href="${esc(item.href)}" class="bottom-nav-item${esActivo ? ' active' : ''}" title="${esc(item.texto)}">
            <i class="bi ${esc(item.icono)}"></i>
            <span>${esc(item.texto)}</span>
          </a>`;
      }).join('');

      this.innerHTML = `
        <!-- Sidebar para escritorio y tablet -->
        <aside class="app-sidebar offcanvas-lg offcanvas-start" tabindex="-1" id="sidebar"
               aria-label="Menú principal de navegación">
          <div class="offcanvas-header d-lg-none border-bottom p-3">
            <span class="brand text-primary fw-bold fs-5">
              <span class="brand-mark me-2" aria-hidden="true">N</span> NETX
            </span>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"
                    data-bs-target="#sidebar" aria-label="Cerrar menú"></button>
          </div>
          <nav class="offcanvas-body flex-column p-0">
            <ul class="nav flex-column side-nav flex-grow-1">${items}</ul>
            <div class="p-3 border-top d-none d-lg-block nav-text">
              <div class="d-flex align-items-center gap-2 text-muted small">
                <span class="pulse-dot"></span>
                <div>
                  <strong class="d-block text-dark">Próxima Sesión</strong>
                  <span style="font-size: 0.78rem;">Martes 07:45 AM</span>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        <!-- Barra inferior fija para celulares (Bottom Navigation) -->
        <nav class="app-bottom-nav d-lg-none" aria-label="Navegación móvil rápida">
          ${bottomItems}
        </nav>`;
    }
  }

  customElements.define('netx-sidebar', NetxSidebar);
})();