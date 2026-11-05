/**
 * NETX · auth.js  — cargar en el <head> de TODAS las páginas protegidas,
 * antes de store.js y de los componentes.
 *  1. Verifica la sesión con backend/api/me.php (si no hay, redirige al login).
 *  2. Sincroniza el usuario real (BD) con NetxStore: el servidor manda sobre localStorage.
 *  3. Valida que el rol pueda ver la página actual.
 *  4. Oculta elementos con data-roles="administrador,coordinador" según el rol.
 * Nota: ocultar elementos es solo comodidad visual. La seguridad real está en
 * router.php y en netx_require_role() de la API.
 */
(() => {
  'use strict';

  const API_ME      = '../backend/api/me.php';
  const LOGIN       = 'login.html';
  const KEY_SESSION = 'netx_session_user';
  const KEY_MEMBERS = 'netx_members_data';

  const leer = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };

  // 1. Consulta sincrónica: debe resolverse antes de que store.js y los componentes lean el usuario.
  let user = null;
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', API_ME, false);
    xhr.withCredentials = true;
    xhr.send();
    if (xhr.status === 200) user = JSON.parse(xhr.responseText).user;
  } catch { /* sin servidor: se trata como sin sesión */ }

  if (!user) {
    try { localStorage.removeItem(KEY_SESSION); } catch { /* ignorar */ }
    document.documentElement.style.display = 'none';
    location.replace(LOGIN);
    return;
  }

  // 2. Sincronizar con NetxStore (el servidor manda en nombre, email, rol y permisos).
  const guardado = leer(KEY_SESSION);
  const local = (guardado && guardado.email === user.email)
    ? guardado
    : (leer(KEY_MEMBERS) || []).find(m => (m.email || '').toLowerCase() === user.email.toLowerCase());
  const actual = { ...(local || {}), ...user, id: local ? local.id : user.id };
  try { localStorage.setItem(KEY_SESSION, JSON.stringify(actual)); } catch { /* ignorar */ }

  // 3. ¿Puede este rol ver esta página?
  const archivo = (location.pathname.split('/').pop() || 'index.html').replace(/\.html?$/, '') || 'index';
  const CLAVE = { index: 'panel', miembros: 'miembros', reglas: 'reglas', reuniones: 'reuniones', referidos: 'referidos', perfil: 'perfil' };
  const clave = CLAVE[archivo];
  if (clave && !user.paginas.includes(clave)) {
    document.documentElement.style.display = 'none';
    location.replace('index.html?acceso=denegado');
    return;
  }

  window.NetxAuth = {
    user: actual,
    rol: user.rolClave,                                   // administrador | coordinador | miembro
    tiene: (...roles) => roles.includes(user.rolClave),
    puedeVer: (c) => user.paginas.includes(c),
  };

  // 4. Mostrar/ocultar según rol
  document.addEventListener('DOMContentLoaded', () => {
    document.body.dataset.rol = user.rolClave;            // permite CSS por rol: body[data-rol="miembro"] ...

    document.querySelectorAll('[data-roles]').forEach((el) => {
      const roles = el.dataset.roles.split(',').map(r => r.trim());
      if (!roles.includes(user.rolClave)) el.classList.add('d-none');
    });

    // Si la pestaña activa quedó oculta, activar la primera visible.
    document.querySelectorAll('.nav-pills').forEach((nav) => {
      const activa = nav.querySelector('.nav-link.active');
      if (activa && activa.classList.contains('d-none')) {
        const primera = nav.querySelector('.nav-link:not(.d-none)');
        if (primera) primera.click();
      }
    });

    if (new URLSearchParams(location.search).get('acceso') === 'denegado') {
      if (window.NetxAlert) window.NetxAlert('Tu rol no tiene permiso para abrir esa sección.', 'warning');
      history.replaceState(null, '', location.pathname);
    }
  });
})();