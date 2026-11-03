/* NETX · main.js — comportamiento común del layout y utilidades */
(() => {
  'use strict';

  const CLAVE_SIDEBAR = 'netx.sidebarColapsado';

  const leerPreferencia = () => {
    try { return localStorage.getItem(CLAVE_SIDEBAR) === '1'; }
    catch { return false; }
  };

  const guardarPreferencia = (valor) => {
    try { localStorage.setItem(CLAVE_SIDEBAR, valor ? '1' : '0'); }
    catch { /* ignorar */ }
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
    // 1. Restaurar preferencia de sidebar colapsable en escritorio
    if (window.innerWidth >= 992) {
      aplicarColapso(leerPreferencia());
    }

    // 2. Año del pie de página
    const anio = document.getElementById('anio');
    if (anio) anio.textContent = new Date().getFullYear();

    // 3. Inicializar Tooltips de Bootstrap si existen
    if (window.bootstrap && typeof window.bootstrap.Tooltip === 'function') {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(el => new window.bootstrap.Tooltip(el));
    }
  });

  // Utilidad global de notificaciones Toast o Alertas flotantes
  window.NetxAlert = (mensaje, tipo = 'success') => {
    const container = document.getElementById('netx-toast-container') || (() => {
      const div = document.createElement('div');
      div.id = 'netx-toast-container';
      div.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      div.style.zIndex = '9999';
      document.body.appendChild(div);
      return div;
    })();

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${tipo === 'danger' ? 'danger' : tipo === 'warning' ? 'warning text-dark' : 'primary'} border-0 shadow-lg`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <i class="bi ${tipo === 'danger' ? 'bi-x-circle' : tipo === 'warning' ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2"></i>
          ${mensaje}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
      </div>`;

    container.appendChild(toastEl);
    if (window.bootstrap && window.bootstrap.Toast) {
      const toast = new window.bootstrap.Toast(toastEl, { delay: 4000 });
      toast.show();
      toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    } else {
      setTimeout(() => toastEl.remove(), 4000);
    }
  };
})();
