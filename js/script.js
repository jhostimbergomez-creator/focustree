document.addEventListener('DOMContentLoaded', () => {
    // 1. Manejo del Formulario de Contacto
    const contactForm = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            
            feedback.textContent = `¡Gracias, ${nombre}! Hemos recibido tu mensaje con éxito.`;
            feedback.style.color = 'green';
            contactForm.reset();
        });
    }

    // 2. Funcionalidad del Tutor IA Focustree
    const iaBtn = document.getElementById('ia-btn');
    const iaInput = document.getElementById('ia-input');
    const iaResponse = document.getElementById('ia-response');

    if (iaBtn) {
        iaBtn.addEventListener('click', () => {
            const query = iaInput.value.trim();
            if (!query) {
                iaResponse.textContent = "Por favor ingresa una pregunta o concepto.";
                return;
            }

            // Estado de Carga (Requisito UX)
            iaResponse.textContent = "Procesando respuesta del tutor Focustree IA...";
            iaBtn.disabled = true;

            setTimeout(() => {
                iaResponse.textContent = `Focustree IA: "Para aprender sobre '${query}', te sugiero dividir el concepto en 3 bloques clave y registrar un apunte corto en tu panel de control."`;
                iaBtn.disabled = false;
                iaInput.value = '';
            }, 1200);
        });
    }
});