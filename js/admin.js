/* ==========================================================
   admin.js – LOGIN Y PANEL PRIVADO
   ----------------------------------------------------------
   ADVERTENCIA HONESTA: en un sitio estático el login se
   verifica en el navegador, y cualquiera que abra el código
   puede ver la clave. Sirve para cumplir el requisito del
   curso y para tener un flujo real de login/logout, pero NO
   protege datos sensibles. La versión segura valida en un
   servidor (Express + sesiones/JWT) y es el siguiente paso.
   ========================================================== */

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'focustree2026';
const SESION_KEY = 'focustree_admin';

const $ = (id) => document.getElementById(id);
const vistaLogin = $('vista-login');
const vistaPanel = $('vista-panel');

// sessionStorage se borra al cerrar la pestaña (a diferencia de localStorage)
const haySesion = () => sessionStorage.getItem(SESION_KEY) === 'ok';

// Muestra una vista u otra según haya sesión
function mostrarVista() {
    const dentro = haySesion();
    vistaLogin.hidden = dentro;
    vistaPanel.hidden = !dentro;
    if (dentro) renderPanel();
}

function renderPanel() {
    const cats = Store.listarCategorias().length;
    const clases = Store.listarClases().length;
    const mensajes = Store.listarMensajes();

    $('stats').innerHTML = `
        <div class="stat"><b>${cats}</b>categorías</div>
        <div class="stat"><b>${clases}</b>clases guardadas</div>
        <div class="stat"><b>${mensajes.length}</b>mensajes recibidos</div>`;

    $('lista-mensajes').innerHTML = mensajes.length
        ? mensajes.map(m => `
            <article class="msg-item">
                <header>
                    <strong>${esc(m.nombre)} <small>${esc(m.email)}</small></strong>
                    <small>${new Date(m.fecha).toLocaleString('es-CO')}</small>
                </header>
                <p>${esc(m.mensaje)}</p>
                <button class="btn btn-peligro btn-chico" data-borrar="${m.id}" style="margin-top:.6rem">Borrar</button>
            </article>`).join('')
        : '<div class="vacio"><strong>Sin mensajes todavía</strong>Los mensajes del formulario de contacto aparecerán aquí.</div>';
}

$('form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    const usuario = $('usuario').value.trim();
    const clave = $('clave').value;
    const msg = $('msg-login');

    if (usuario === ADMIN_USER && clave === ADMIN_PASS) {
        sessionStorage.setItem(SESION_KEY, 'ok');
        msg.textContent = '';
        e.target.reset();
        mostrarVista();
    } else {
        msg.textContent = 'Usuario o contraseña incorrectos.';
    }
});

$('btn-salir').addEventListener('click', () => {
    sessionStorage.removeItem(SESION_KEY);
    mostrarVista();
});

$('lista-mensajes').addEventListener('click', (e) => {
    const id = e.target.dataset.borrar;
    if (id && confirm('¿Borrar este mensaje?')) {
        Store.borrarMensaje(id);
        renderPanel();
    }
});

mostrarVista();
