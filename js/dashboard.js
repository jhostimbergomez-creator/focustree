/* ==========================================================
   dashboard.js – PANTALLA PRINCIPAL DE LA APP
   ----------------------------------------------------------
   Patrón que usa todo el archivo:
     1. `estado` guarda qué categoría/clase está abierta.
     2. Una función render*() dibuja HTML según el estado.
     3. Los clics y envíos de formularios cambian el estado
        o los datos y vuelven a llamar a render().
   Es la misma idea de React, pero a mano.
   ========================================================== */

const estado = { catId: null, claseId: null };

const $ = (id) => document.getElementById(id);
const listaCats = $('lista-cats');
const area = $('area');
const formCat = $('form-cat');
const inputCat = $('nueva-cat');
const msgCat = $('msg-cat');

// Fecha de hoy en formato AAAA-MM-DD según la hora local
function hoy() {
    const d = new Date();
    return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

/* ---------------- RENDER: columna izquierda ---------------- */
function renderCategorias() {
    const cats = Store.listarCategorias();
    listaCats.innerHTML = cats.map(c => {
        const n = Store.listarClases(c.id).length;
        const activa = c.id === estado.catId ? ' activa' : '';
        return `<li><button class="cat-btn${activa}" data-id="${c.id}">
                    <span>${esc(c.nombre)}</span><span class="num">${n}</span>
                </button></li>`;
    }).join('');
}

/* ---------------- RENDER: área de trabajo ------------------ */
function renderArea() {
    const cats = Store.listarCategorias();

    if (!cats.length) {
        area.innerHTML = `<div class="vacio"><strong>Aún no tienes categorías</strong>
            Crea la primera a la izquierda, por ejemplo «Java» o «Inglés».</div>`;
        return;
    }
    const cat = cats.find(c => c.id === estado.catId);
    if (!cat) {
        area.innerHTML = `<div class="vacio"><strong>Elige una categoría</strong>
            Verás sus clases aquí.</div>`;
        return;
    }
    if (estado.claseId) {
        const clase = Store.listarClases(cat.id).find(c => c.id === estado.claseId);
        if (clase) return renderDetalle(clase);
        estado.claseId = null; // la clase ya no existe
    }
    renderCategoria(cat);
}

// Vista: lista de clases de una categoría + formulario para crear
function renderCategoria(cat) {
    const clases = Store.listarClases(cat.id);

    const tarjetas = clases.length
        ? `<div class="grid-clases">${clases.map(c => `
            <button class="clase-card" data-accion="abrir-clase" data-id="${c.id}">
                <small>${esc(c.fecha)}</small>
                <h3>${esc(c.tema)}</h3>
                ${c.noEntendi && c.noEntendi.trim()
                    ? '<span class="etiqueta-pend">Tiene dudas pendientes</span>'
                    : '<span class="etiqueta-ok">Todo entendido</span>'}
            </button>`).join('')}</div>`
        : `<div class="vacio"><strong>Esta categoría no tiene clases</strong>
            Abre «Nueva clase» y registra la primera.</div>`;

    area.innerHTML = `
        <div class="cabecera-cat">
            <h2>${esc(cat.nombre)}</h2>
            <div>
                <button class="btn btn-sec btn-chico" data-accion="vacios">Detectar vacíos</button>
                <button class="btn btn-peligro btn-chico" data-accion="borrar-cat">Borrar categoría</button>
            </div>
        </div>

        <div id="ia-cat" class="ia-salida" hidden></div>

        <details class="desplegable">
            <summary><span class="btn btn-chico">+ Nueva clase</span></summary>
            <form id="form-clase" novalidate>
                <label for="c-fecha">Fecha</label>
                <input type="date" id="c-fecha" value="${hoy()}" required>
                <label for="c-tema">Tema</label>
                <input type="text" id="c-tema" placeholder="Ej: Herencia en Java" maxlength="80" required>
                <label for="c-aprendi">Qué aprendí</label>
                <textarea id="c-aprendi" rows="3" placeholder="Una idea por línea o separadas por punto" required></textarea>
                <label for="c-no">Qué no entendí</label>
                <textarea id="c-no" rows="2" placeholder="Déjalo vacío si entendiste todo"></textarea>
                <label for="c-notas">Notas</label>
                <textarea id="c-notas" rows="2"></textarea>
                <button type="submit" class="btn">Guardar clase</button>
                <p id="msg-clase" class="mensaje error" role="alert"></p>
            </form>
        </details>

        ${tarjetas}`;
}

// Vista: una clase abierta + panel de IA
function renderDetalle(c) {
    const bloque = (titulo, texto) => texto && texto.trim()
        ? `<div class="bloque"><h4>${titulo}</h4><p>${esc(texto)}</p></div>` : '';

    area.innerHTML = `
        <div class="cabecera-cat">
            <button class="btn btn-sec btn-chico" data-accion="volver">Volver</button>
            <button class="btn btn-peligro btn-chico" data-accion="borrar-clase" data-id="${c.id}">Borrar clase</button>
        </div>
        <div class="detalle">
            <small>${esc(c.fecha)}</small>
            <h3>${esc(c.tema)}</h3>
            ${bloque('Qué aprendí', c.aprendi)}
            ${bloque('Qué no entendí', c.noEntendi)}
            ${bloque('Notas', c.notas)}
        </div>

        <div class="ia-panel">
            <h4>IA con tus apuntes</h4>
            <div class="ia-botones">
                <button class="btn btn-chico" data-ia data-accion="resumir">Resumir esta clase</button>
                <button class="btn btn-chico" data-ia data-accion="preguntas">Generar preguntas de estudio</button>
            </div>
            <form id="form-pregunta" class="form-inline" novalidate>
                <input type="text" id="pregunta" placeholder="Pregunta algo sobre esta categoría" maxlength="120">
                <button type="submit" class="btn btn-chico" data-ia>Preguntar</button>
            </form>
            <div id="ia-salida" class="ia-salida" style="margin-top:.8rem">Elige una acción para empezar.</div>
        </div>`;
}

function render() {
    renderCategorias();
    renderArea();
}

/* ---------------- IA: estado de carga ---------------------- */
// Recibe una función que calcula el texto; muestra "Pensando…" un momento
function mostrarIA(calcular, salidaId = 'ia-salida') {
    const salida = $(salidaId);
    const botones = area.querySelectorAll('[data-ia]');
    salida.hidden = false;
    salida.className = 'ia-salida cargando';
    salida.textContent = 'Pensando…';
    botones.forEach(b => b.disabled = true);

    setTimeout(() => {
        salida.className = 'ia-salida';
        salida.textContent = calcular();
        botones.forEach(b => b.disabled = false);
    }, 600);
}

/* ---------------- EVENTOS ---------------------------------- */
// Elegir categoría
listaCats.addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-btn');
    if (!btn) return;
    estado.catId = btn.dataset.id;
    estado.claseId = null;
    render();
});

// Crear categoría
formCat.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = inputCat.value.trim();
    if (nombre.length < 2) { msgCat.textContent = 'Escribe un nombre de al menos 2 letras.'; return; }
    const existe = Store.listarCategorias().some(c => c.nombre.toLowerCase() === nombre.toLowerCase());
    if (existe) { msgCat.textContent = 'Esa categoría ya existe.'; return; }

    const cat = Store.crearCategoria(nombre);
    estado.catId = cat.id;
    estado.claseId = null;
    inputCat.value = '';
    msgCat.textContent = '';
    render();
});

// Clics dentro del área de trabajo (delegación: un solo listener para todo)
area.addEventListener('click', (e) => {
    const el = e.target.closest('[data-accion]');
    if (!el) return;
    const accion = el.dataset.accion;
    const clases = Store.listarClases(estado.catId);
    const actual = clases.find(c => c.id === estado.claseId);

    switch (accion) {
        case 'abrir-clase': estado.claseId = el.dataset.id; render(); break;
        case 'volver': estado.claseId = null; render(); break;
        case 'borrar-clase':
            if (confirm('¿Borrar esta clase? No se puede deshacer.')) {
                Store.borrarClase(el.dataset.id);
                estado.claseId = null;
                render();
            }
            break;
        case 'borrar-cat':
            if (confirm('¿Borrar la categoría y todas sus clases?')) {
                Store.borrarCategoria(estado.catId);
                estado.catId = null;
                render();
            }
            break;
        case 'resumir': if (actual) mostrarIA(() => IA.resumir(actual)); break;
        case 'preguntas': if (actual) mostrarIA(() => IA.preguntas(actual)); break;
        case 'vacios': mostrarIA(() => IA.vacios(clases), 'ia-cat'); break;
    }
});

// Envíos de formularios dentro del área (nueva clase y pregunta a la IA)
area.addEventListener('submit', (e) => {
    e.preventDefault();

    if (e.target.id === 'form-clase') {
        const datos = {
            categoriaId: estado.catId,
            fecha: $('c-fecha').value,
            tema: $('c-tema').value.trim(),
            aprendi: $('c-aprendi').value.trim(),
            noEntendi: $('c-no').value.trim(),
            notas: $('c-notas').value.trim()
        };
        const msg = $('msg-clase');
        if (!datos.fecha) { msg.textContent = 'Elige una fecha.'; return; }
        if (datos.tema.length < 3) { msg.textContent = 'El tema necesita al menos 3 letras.'; return; }
        if (datos.aprendi.length < 5) { msg.textContent = 'Cuenta qué aprendiste (mínimo 5 letras).'; return; }

        Store.crearClase(datos);
        render();
    }

    if (e.target.id === 'form-pregunta') {
        const q = $('pregunta').value.trim();
        const clases = Store.listarClases(estado.catId);
        if (!q) { $('ia-salida').textContent = 'Escribe una pregunta primero.'; return; }
        mostrarIA(() => IA.preguntar(q, clases));
    }
});

// Arranque: selecciona la primera categoría si existe
const primeras = Store.listarCategorias();
if (primeras.length) estado.catId = primeras[0].id;
render();
