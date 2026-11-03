/**
 * NETX · header.js
 * Componente web <netx-header>
 * Encabezado universal oficial de NETX con fondo azul institucional (#1F4E79),
 * logotipo, Capítulo Morelia con indicador activo, notificaciones y menú de usuario
 * con avatar interactivo (Diego Uriel Méndez Rodríguez), carga de foto y temas.
 */
(() => {
  'use strict';

  const esc = (texto) => {
    const div = document.createElement('div');
    div.textContent = texto || '';
    return div.innerHTML.replace(/"/g, '&quot;');
  };

  // Aplicar tema guardado al cargar
  const savedTheme = localStorage.getItem('netx_theme_color') || '#1F4E79';
  document.documentElement.style.setProperty('--netx-primary', savedTheme);
  document.documentElement.style.setProperty('--primary-color', savedTheme);

  class NetxHeader extends HTMLElement {
    connectedCallback() {
      this.render();
      window.addEventListener('netx:user-changed', () => this.render());
      window.addEventListener('netx:avatar-changed', () => this.render());
      window.addEventListener('netx:theme-changed', () => this.render());
      this.ensureModalsInjected();
    }

    render() {
      const user = window.NetxStore ? window.NetxStore.getCurrentUser() : {
        nombre: 'Diego Uriel Méndez Rodríguez',
        rol: 'Administrador',
        avatar: 'D',
        email: 'admin@netx.com'
      };

      const rules = window.NetxStore ? window.NetxStore.getRules() : {
        nombreCapitulo: 'Capítulo Morelia'
      };

      const capitulo = this.getAttribute('chapter') || rules.nombreCapitulo || 'Capítulo Morelia';
      const nombre = user.nombre || 'Diego Uriel Méndez Rodríguez';
      const rol = user.rol || 'Administrador';
      const customAvatar = localStorage.getItem('netx_custom_avatar');
      const avatarSrc = customAvatar || (user.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('data:')) ? user.avatar : null);
      const inicial = user.avatarInicial || (nombre.trim().charAt(0).toUpperCase()) || 'D';

      const avatarHtml = avatarSrc
        ? `<img src="${avatarSrc}" alt="${esc(nombre)}" style="width: 100%; height: 100%; object-fit: cover;">`
        : `<span class="user-initial">${esc(inicial)}</span>`;

      this.innerHTML = `
        <header class="app-header navbar navbar-expand fixed-top px-3">
          <div class="header-start">
            <!-- Botón colapsar / desplegar barra izquierda -->
            <button class="btn btn-icon me-2" type="button"
                    id="btnColapsar" aria-controls="sidebar" aria-expanded="true"
                    aria-label="Contraer o desplegar menú lateral" title="Contraer o desplegar menú lateral"
                    onclick="window.NetxComponents.toggleSidebar(event)">
              <i class="bi bi-layout-sidebar-inset"></i>
            </button>

            <!-- Logotipo Oficial NETX -->
            <a class="navbar-brand brand" href="index.html" title="Inicio NETX">
              <span class="brand-mark" aria-hidden="true">N</span>
              <span class="brand-text">NETX</span>
            </a>

            <!-- Indicador de Capítulo Oficial -->
            <div class="chapter-container d-none d-sm-inline-flex">
              <span class="pulse-dot" title="Sesión activa"></span>
              <span class="chapter-name">${esc(capitulo)}</span>
            </div>
          </div>

          <!-- Zona Derecha: Notificaciones y Perfil -->
          <div class="ms-auto d-flex align-items-center gap-2">
            <!-- Campana de Notificaciones -->
            <div class="dropdown">
              <button class="btn btn-icon position-relative" type="button"
                      data-bs-toggle="dropdown" aria-expanded="false" data-bs-offset="0,8" title="Notificaciones internas del capítulo">
                <i class="bi bi-bell"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.65rem; margin-left: -6px; margin-top: 6px;">
                  3
                  <span class="visually-hidden">notificaciones sin leer</span>
                </span>
              </button>
              <div class="dropdown-menu dropdown-menu-end p-2 shadow" style="min-width: 300px; border-radius: 18px; border: 1px solid rgba(0,0,0,0.08);">
                <div class="d-flex justify-content-between align-items-center px-2 py-1 mb-1 border-bottom">
                  <h6 class="dropdown-header px-0 py-0 text-primary fw-bold mb-0" style="font-size: 0.85rem;">Notificaciones del Capítulo</h6>
                  <span class="badge bg-primary-subtle text-primary rounded-pill">3 nuevas</span>
                </div>
                <div class="list-group list-group-flush small">
                  <a href="reuniones.html" class="list-group-item list-group-item-action px-2 py-2 rounded-3 border-0 mb-1">
                    <div class="fw-semibold text-dark"><i class="bi bi-calendar-check text-primary me-1"></i> Asistencia en espera</div>
                    <small class="text-muted">Luis Morales registró asistencia para hoy.</small>
                  </a>
                  <a href="referidos.html" class="list-group-item list-group-item-action px-2 py-2 rounded-3 border-0 mb-1">
                    <div class="fw-semibold text-dark"><i class="bi bi-arrow-left-right text-success me-1"></i> Nuevo referido emitido</div>
                    <small class="text-muted">Juan Pérez envió prospecto a María González.</small>
                  </a>
                  <a href="reuniones.html" class="list-group-item list-group-item-action px-2 py-2 rounded-3 border-0">
                    <div class="fw-semibold text-dark"><i class="bi bi-exclamation-triangle text-warning me-1"></i> Inasistencia registrada</div>
                    <small class="text-muted">Pedro Rodríguez acumula 2 faltas consecutivas.</small>
                  </a>
                </div>
              </div>
            </div>

            <!-- Menú Desplegable del Usuario -->
            <div class="dropdown">
              <button class="btn btn-user dropdown-toggle" type="button"
                      data-bs-toggle="dropdown" aria-expanded="false" data-bs-offset="0,8" id="headerUserDropdownBtn">
                <span class="avatar" id="headerAvatarContainer">
                  ${avatarHtml}
                </span>
                <span class="d-none d-md-inline ms-1 fw-semibold text-white">${esc(nombre)}</span>
                <i class="bi bi-chevron-down text-white-50 ms-1 small"></i>
              </button>

              <ul class="dropdown-menu dropdown-menu-end shadow p-2" style="min-width: 270px; border-radius: 18px; border: 1px solid rgba(0,0,0,0.08);">
                <li class="px-3 py-2 border-bottom mb-2">
                  <div class="fw-bold text-dark text-truncate">${esc(nombre)}</div>
                  <div class="small text-muted text-truncate">${esc(user.email || 'admin@netx.com')}</div>
                  <div class="mt-1">
                    <span class="badge ${rol === 'Administrador' ? 'bg-primary' : rol === 'Coordinador' ? 'bg-warning text-dark' : 'bg-secondary'} rounded-pill px-2 py-1">
                      <i class="bi ${rol === 'Administrador' ? 'bi-shield-check' : rol === 'Coordinador' ? 'bi-clock-history' : 'bi-person'} me-1"></i>
                      ${esc(rol)}
                    </span>
                  </div>
                </li>

                <!-- OPCIÓN FUNCIONAL JS: Simular Carga de Foto de Perfil -->
                <li>
                  <button class="dropdown-item py-2 rounded-3 d-flex align-items-center gap-2" type="button"
                          onclick="window.NetxComponents.abrirModalFoto()">
                    <i class="bi bi-camera-fill text-primary fs-5"></i>
                    <div>
                      <div class="fw-semibold text-dark" style="font-size: 0.88rem;">Cambiar Foto de Perfil</div>
                      <small class="text-muted" style="font-size: 0.75rem;">Subir archivo o elegir avatar</small>
                    </div>
                  </button>
                </li>

                <!-- OPCIÓN FUNCIONAL JS: Personalización de Colores del Tema -->
                <li>
                  <button class="dropdown-item py-2 rounded-3 d-flex align-items-center gap-2" type="button"
                          onclick="window.NetxComponents.abrirModalTema()">
                    <i class="bi bi-palette-fill text-primary fs-5"></i>
                    <div>
                      <div class="fw-semibold text-dark" style="font-size: 0.88rem;">Personalizar Color de Tema</div>
                      <small class="text-muted" style="font-size: 0.75rem;">Ajustar paleta institucional</small>
                    </div>
                  </button>
                </li>

                <li><hr class="dropdown-divider my-2"></li>

                <!-- Mi Perfil -->
                <li>
                  <a class="dropdown-item py-2 rounded-3 d-flex align-items-center gap-2" href="perfil.html">
                    <i class="bi bi-person-circle fs-5 text-secondary"></i>
                    <span class="fw-semibold text-dark" style="font-size: 0.88rem;">Mi Perfil y Estadísticas</span>
                  </a>
                </li>

                <li><hr class="dropdown-divider my-2"></li>

                <!-- Cerrar Sesión -->
                <li>
                  <button class="dropdown-item py-2 rounded-3 d-flex align-items-center gap-2 text-danger" type="button"
                          onclick="window.NetxStore ? window.NetxStore.logout() : (window.location.href='login.html')">
                    <i class="bi bi-box-arrow-right fs-5"></i>
                    <span class="fw-semibold" style="font-size: 0.88rem;">Cerrar Sesión</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </header>
      `;
    }

    ensureModalsInjected() {
      if (document.getElementById('modalFotoPerfilHeader')) return;

      const modalContainer = document.createElement('div');
      modalContainer.id = 'netxHeaderModalsContainer';
      modalContainer.innerHTML = `
        <!-- Input File Oculto para Cargar Foto -->
        <input type="file" id="netxAvatarFileInput" accept="image/*" style="display:none;" onchange="window.NetxComponents.handleAvatarFile(event)">

        <!-- Modal para Cambiar Foto de Perfil -->
        <div class="modal fade" id="modalFotoPerfilHeader" tabindex="-1" aria-labelledby="modalFotoPerfilHeaderLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" style="border-radius: 24px; border: none; box-shadow: 0 20px 40px rgba(0,0,0,0.18);">
              <div class="modal-header border-0 pb-0 px-4 pt-4">
                <h5 class="modal-title fw-bold" id="modalFotoPerfilHeaderLabel">
                  <i class="bi bi-camera-fill text-primary me-2"></i> Foto de Perfil
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div class="modal-body p-4 text-center">
                <div class="mx-auto mb-3" style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden; border: 3px solid #1F4E79; box-shadow: 0 4px 15px rgba(31,78,121,0.2); background: #1F4E79; display: grid; place-items: center;">
                  <img id="netxAvatarPreviewImg" src="" alt="Previsualización" style="width: 100%; height: 100%; object-fit: cover; display: none;">
                  <span id="netxAvatarPreviewInitial" class="fs-1 text-white fw-bold">D</span>
                </div>
                <p class="text-muted small mb-3">
                  Selecciona una imagen desde tu dispositivo o elige un avatar predeterminado.
                </p>
                <button type="button" class="btn btn-primary rounded-pill w-100 py-2 mb-3 shadow-sm" onclick="document.getElementById('netxAvatarFileInput').click()">
                  <i class="bi bi-upload me-2"></i> Subir imagen desde el equipo
                </button>
                <div class="text-muted small mb-2 fw-semibold">— Opciones rápidas —</div>
                <div class="d-flex justify-content-center gap-2 flex-wrap">
                  <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-3" onclick="window.NetxComponents.setPresetAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80')">
                    Directora
                  </button>
                  <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-3" onclick="window.NetxComponents.setPresetAvatar('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80')">
                    Director
                  </button>
                  <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-3" onclick="window.NetxComponents.resetAvatar()">
                    Solo Inicial
                  </button>
                </div>
              </div>
              <div class="modal-footer border-0 pt-0 px-4 pb-4">
                <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Listo</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal para Personalizar Color de Tema -->
        <div class="modal fade" id="modalColorTemaHeader" tabindex="-1" aria-labelledby="modalColorTemaHeaderLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" style="border-radius: 24px; border: none; box-shadow: 0 20px 40px rgba(0,0,0,0.18);">
              <div class="modal-header border-0 pb-0 px-4 pt-4">
                <h5 class="modal-title fw-bold" id="modalColorTemaHeaderLabel">
                  <i class="bi bi-palette-fill text-primary me-2"></i> Personalizar Color del Tema
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div class="modal-body p-4">
                <p class="text-muted small mb-3">
                  Selecciona una de las combinaciones ejecutivas inspiradas en Apple o elige un color libre para adaptar la interfaz a tu preferencia.
                </p>
                <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-3">
                  <div class="fw-semibold text-dark small">Selector Libre:</div>
                  <input type="color" id="netxColorPickerNative" value="${savedTheme}" style="width: 38px; height: 38px; border: none; background: transparent; cursor: pointer;" onchange="window.NetxComponents.aplicarColorTema(this.value)">
                </div>
                <div class="small fw-semibold text-muted mb-2">Paletas Ejecutivas Sugeridas:</div>
                <div class="d-grid gap-2">
                  <button type="button" class="btn btn-outline-light text-dark border d-flex align-items-center justify-content-between p-2 rounded-3 text-start" onclick="window.NetxComponents.aplicarColorTema('#1F4E79')">
                    <span class="d-flex align-items-center gap-2">
                      <span style="width: 22px; height: 22px; border-radius: 50%; background: #1F4E79; display: inline-block;"></span>
                      <strong>Azul Institucional NETX</strong>
                    </span>
                    <small class="text-muted">#1F4E79</small>
                  </button>
                  <button type="button" class="btn btn-outline-light text-dark border d-flex align-items-center justify-content-between p-2 rounded-3 text-start" onclick="window.NetxComponents.aplicarColorTema('#0D6EFD')">
                    <span class="d-flex align-items-center gap-2">
                      <span style="width: 22px; height: 22px; border-radius: 50%; background: #0D6EFD; display: inline-block;"></span>
                      <strong>Zafiro Apple</strong>
                    </span>
                    <small class="text-muted">#0D6EFD</small>
                  </button>
                  <button type="button" class="btn btn-outline-light text-dark border d-flex align-items-center justify-content-between p-2 rounded-3 text-start" onclick="window.NetxComponents.aplicarColorTema('#0F766E')">
                    <span class="d-flex align-items-center gap-2">
                      <span style="width: 22px; height: 22px; border-radius: 50%; background: #0F766E; display: inline-block;"></span>
                      <strong>Verde Esmeralda</strong>
                    </span>
                    <small class="text-muted">#0F766E</small>
                  </button>
                  <button type="button" class="btn btn-outline-light text-dark border d-flex align-items-center justify-content-between p-2 rounded-3 text-start" onclick="window.NetxComponents.aplicarColorTema('#4338CA')">
                    <span class="d-flex align-items-center gap-2">
                      <span style="width: 22px; height: 22px; border-radius: 50%; background: #4338CA; display: inline-block;"></span>
                      <strong>Índigo Ejecutivo</strong>
                    </span>
                    <small class="text-muted">#4338CA</small>
                  </button>
                  <button type="button" class="btn btn-outline-light text-dark border d-flex align-items-center justify-content-between p-2 rounded-3 text-start" onclick="window.NetxComponents.aplicarColorTema('#1F2937')">
                    <span class="d-flex align-items-center gap-2">
                      <span style="width: 22px; height: 22px; border-radius: 50%; background: #1F2937; display: inline-block;"></span>
                      <strong>Grafito Apple</strong>
                    </span>
                    <small class="text-muted">#1F2937</small>
                  </button>
                </div>
              </div>
              <div class="modal-footer border-0 pt-0 px-4 pb-4">
                <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Listo</button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modalContainer);
    }
  }

  customElements.define('netx-header', NetxHeader);

  // Funciones globales de conveniencia para interactividad del Header
  window.NetxComponents = window.NetxComponents || {};

  window.NetxComponents.toggleSidebar = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const sidebarEl = document.getElementById('sidebar');
    if (window.innerWidth < 992) {
      // En móvil o tablet (<992px), despliega o cierra el offcanvas
      if (sidebarEl && window.bootstrap && window.bootstrap.Offcanvas) {
        const bsOffcanvas = window.bootstrap.Offcanvas.getOrCreateInstance(sidebarEl);
        bsOffcanvas.toggle();
      }
    } else {
      // En escritorio (>=992px), colapsa o expande la barra lateral
      const colapsar = !document.body.classList.contains('sidebar-collapsed');
      document.body.classList.toggle('sidebar-collapsed', colapsar);
      try {
        localStorage.setItem('netx.sidebarColapsado', colapsar ? '1' : '0');
      } catch (e) {}
      const btn = document.getElementById('btnColapsar');
      if (btn) {
        btn.setAttribute('aria-expanded', String(!colapsar));
        btn.setAttribute('aria-label', colapsar ? 'Expandir menú lateral' : 'Contraer menú lateral');
      }
    }
  };

  window.NetxComponents.abrirModalFoto = () => {
    const modalEl = document.getElementById('modalFotoPerfilHeader');
    if (!modalEl) return;
    const previewImg = document.getElementById('netxAvatarPreviewImg');
    const previewInitial = document.getElementById('netxAvatarPreviewInitial');
    const customAvatar = localStorage.getItem('netx_custom_avatar');
    if (customAvatar && previewImg && previewInitial) {
      previewImg.src = customAvatar;
      previewImg.style.display = 'block';
      previewInitial.style.display = 'none';
    }
    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
  };

  window.NetxComponents.handleAvatarFile = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      localStorage.setItem('netx_custom_avatar', dataUrl);
      window.dispatchEvent(new CustomEvent('netx:avatar-changed'));
      const previewImg = document.getElementById('netxAvatarPreviewImg');
      const previewInitial = document.getElementById('netxAvatarPreviewInitial');
      if (previewImg && previewInitial) {
        previewImg.src = dataUrl;
        previewImg.style.display = 'block';
        previewInitial.style.display = 'none';
      }
    };
    reader.readAsDataURL(file);
  };

  window.NetxComponents.setPresetAvatar = (url) => {
    localStorage.setItem('netx_custom_avatar', url);
    window.dispatchEvent(new CustomEvent('netx:avatar-changed'));
    const previewImg = document.getElementById('netxAvatarPreviewImg');
    const previewInitial = document.getElementById('netxAvatarPreviewInitial');
    if (previewImg && previewInitial) {
      previewImg.src = url;
      previewImg.style.display = 'block';
      previewInitial.style.display = 'none';
    }
  };

  window.NetxComponents.resetAvatar = () => {
    localStorage.removeItem('netx_custom_avatar');
    window.dispatchEvent(new CustomEvent('netx:avatar-changed'));
    const previewImg = document.getElementById('netxAvatarPreviewImg');
    const previewInitial = document.getElementById('netxAvatarPreviewInitial');
    if (previewImg && previewInitial) {
      previewImg.style.display = 'none';
      previewInitial.style.display = 'block';
    }
  };

  window.NetxComponents.abrirModalTema = () => {
    const modalEl = document.getElementById('modalColorTemaHeader');
    if (!modalEl) return;
    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
  };

  window.NetxComponents.aplicarColorTema = (hexColor) => {
    if (!hexColor) return;
    localStorage.setItem('netx_theme_color', hexColor);
    document.documentElement.style.setProperty('--netx-primary', hexColor);
    document.documentElement.style.setProperty('--primary-color', hexColor);
    const nativePicker = document.getElementById('netxColorPickerNative');
    if (nativePicker) nativePicker.value = hexColor;
    window.dispatchEvent(new CustomEvent('netx:theme-changed'));
  };
})();
