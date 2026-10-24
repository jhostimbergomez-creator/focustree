/* ==========================================================
   script.js – HOME: formulario de contacto
   Flujo: usuario envía → validamos → guardamos en Store →
   mostramos confirmación. El admin lee esos mensajes luego.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    const boton = document.getElementById('contact-btn');

    // Si esta página no tiene el formulario, no hacemos nada
    if (!form) return;

    // Helper para pintar mensajes en verde (ok) o rojo (error)
    function avisar(texto, tipo) {
        feedback.textContent = texto;
        feedback.className = 'mensaje ' + tipo;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // evita que la página se recargue

        const nombre = form.nombre.value.trim();
        const email = form.email.value.trim();
        const mensaje = form.mensaje.value.trim();

        // Validaciones con mensajes que dicen qué corregir
        if (nombre.length < 2) return avisar('Escribe tu nombre (mínimo 2 letras).', 'error');
        if (!/^\S+@\S+\.\S+$/.test(email)) return avisar('El correo no es válido. Ejemplo: tu@email.com', 'error');
        if (mensaje.length < 10) return avisar('El mensaje es muy corto. Cuéntanos un poco más.', 'error');

        // Estado de carga (requisito UX del curso)
        boton.disabled = true;
        avisar('Enviando…', '');

        setTimeout(() => {
            Store.guardarMensaje({ nombre, email, mensaje });
            avisar(`Gracias, ${nombre}. Recibimos tu mensaje.`, 'ok');
            form.reset();
            boton.disabled = false;
        }, 700);
    });
});
