/**
 * NETX · login.js
 * Autentica contra backend/api/login.php (MySQL) y guarda la sesión en NetxStore.
 * Sustituye el <script> en línea de login.html.
 */
(() => {
  'use strict';

  const API_LOGIN = '../backend/api/login.php';
  const DEMO_PASSWORD = 'Netx2026*';   // contraseña del seed (quitar en producción)

  const form     = document.getElementById('loginForm');
  const alertBox = document.getElementById('loginAlert');
  const alertMsg = document.getElementById('loginAlertMsg');
  const submitBt = form.querySelector('button[type="submit"]');

  const showError = (msg) => {
    alertMsg.textContent = msg;
    alertBox.classList.remove('d-none');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.classList.add('d-none');

    const email    = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value;

    submitBt.disabled = true;
    try {
      const resp = await fetch(API_LOGIN, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await resp.json().catch(() => ({}));

      if (!resp.ok || !data.success) {
        showError(data.message || 'No se pudo iniciar sesión.');
        return;
      }

      // Reutiliza datos demo del store (mismo correo) para que el resto de pantallas siga funcionando.
      const local = (window.NetxStore.getMembers() || [])
        .find(m => m.email.toLowerCase() === data.user.email.toLowerCase());
      window.NetxStore.setCurrentUser({ ...(local || {}), ...data.user, id: local ? local.id : data.user.id });

      window.location.href = data.redirect || 'index.html';
    } catch (err) {
      showError('No se pudo contactar al servidor. ¿Está corriendo PHP y MySQL?');
    } finally {
      submitBt.disabled = false;
    }
  });

  // Botones de "Acceso rápido para pruebas"
  window.autoLogin = (email) => {
    document.getElementById('emailInput').value = email;
    document.getElementById('passwordInput').value = DEMO_PASSWORD;
    form.requestSubmit();
  };
})();