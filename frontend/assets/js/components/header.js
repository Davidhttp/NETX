/**
 * Componente <netx-header>
 *
 * Atributos opcionales:
 *   chapter    Nombre del capítulo.   (por defecto: "Capítulo Morelia")
 *   user-name  Nombre del usuario.    (por defecto: "Usuario")
 *   user-role  Rol del usuario.       (por defecto: "Sin sesión")
 *   home       Enlace del logotipo.   (por defecto: "index.html")
 *
 * Ejemplo:
 *   <netx-header chapter="Capítulo Morelia" user-name="Ana" user-role="Administrador"></netx-header>
 *
 * Estilos: assets/css/components/header.css
 */
(() => {
  'use strict';

  const esc = (texto) => {
    const nodo = document.createElement('div');
    nodo.textContent = texto;
    return nodo.innerHTML.replace(/"/g, '&quot;');
  };

  class NetxHeader extends HTMLElement {
    connectedCallback() {
      const capitulo = this.getAttribute('chapter') || 'Capítulo Morelia';
      const nombre   = this.getAttribute('user-name') || 'Usuario';
      const rol      = this.getAttribute('user-role') || 'Sin sesión';
      const inicio   = this.getAttribute('home') || 'index.html';
      const inicial  = nombre.trim().charAt(0).toUpperCase();

      this.innerHTML = `
        <header class="app-header navbar navbar-expand fixed-top px-3">
          <button class="btn btn-icon d-lg-none me-2" type="button"
                  data-bs-toggle="offcanvas" data-bs-target="#sidebar"
                  aria-controls="sidebar" aria-label="Abrir menú">
            <i class="bi bi-list fs-4"></i>
          </button>

          <button class="btn btn-icon d-none d-lg-inline-flex me-2" type="button"
                  id="btnColapsar" aria-controls="sidebar" aria-expanded="true"
                  aria-label="Contraer menú lateral">
            <i class="bi bi-layout-sidebar-inset fs-5"></i>
          </button>

          <a class="navbar-brand brand" href="${esc(inicio)}">
            <span class="brand-mark" aria-hidden="true">N</span>NETX
          </a>

          <span class="chapter-name d-none d-md-inline ms-3">${esc(capitulo)}</span>

          <div class="ms-auto dropdown">
            <button class="btn btn-user dropdown-toggle" type="button"
                    data-bs-toggle="dropdown" aria-expanded="false">
              <span class="avatar" aria-hidden="true">${esc(inicial)}</span>
              <span class="d-none d-sm-inline ms-2">${esc(nombre)}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><h6 class="dropdown-header">${esc(rol)}</h6></li>
              <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>Mi perfil</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#"><i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión</a></li>
            </ul>
          </div>
        </header>`;
    }
  }

  customElements.define('netx-header', NetxHeader);
})();