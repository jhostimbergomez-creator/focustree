/* ==========================================================
   storage.js – CAPA DE DATOS
   ----------------------------------------------------------
   GitHub Pages solo sirve archivos estáticos: no puede correr
   Node ni una base de datos. Por eso guardamos todo en
   localStorage (memoria del navegador, sobrevive al recargar).

   IDEA CLAVE: ninguna otra parte del código toca localStorage.
   Todo pasa por el objeto `Store`. Si mañana tienes un backend
   real (Express + SQLite), solo reescribes estas funciones con
   fetch() y el resto de la app sigue igual.
   ========================================================== */

const DB_KEY = 'focustree_db_v1';

const Store = {
    /* ---------- Bajo nivel: leer y escribir toda la "base" ---------- */
    _leer() {
        try {
            const crudo = localStorage.getItem(DB_KEY);
            if (crudo) return JSON.parse(crudo);
        } catch (e) {
            console.warn('Datos dañados, se reinicia la base.', e);
        }
        return { categorias: [], clases: [], mensajes: [] };
    },

    _guardar(db) {
        localStorage.setItem(DB_KEY, JSON.stringify(db));
    },

    // Identificador único: tiempo actual + 4 letras al azar
    uid() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    },

    /* ---------- Categorías ---------- */
    listarCategorias() {
        return this._leer().categorias;
    },

    crearCategoria(nombre) {
        const db = this._leer();
        const cat = { id: this.uid(), nombre };
        db.categorias.push(cat);
        this._guardar(db);
        return cat;
    },

    // Al borrar una categoría también borramos sus clases
    borrarCategoria(id) {
        const db = this._leer();
        db.categorias = db.categorias.filter(c => c.id !== id);
        db.clases = db.clases.filter(cl => cl.categoriaId !== id);
        this._guardar(db);
    },

    /* ---------- Clases ---------- */
    listarClases(categoriaId) {
        const todas = this._leer().clases;
        // Sin argumento devuelve todas (lo usa el admin)
        const lista = categoriaId ? todas.filter(c => c.categoriaId === categoriaId) : todas;
        return lista.sort((a, b) => b.fecha.localeCompare(a.fecha)); // más reciente primero
    },

    crearClase(datos) {
        const db = this._leer();
        const clase = { id: this.uid(), ...datos };
        db.clases.push(clase);
        this._guardar(db);
        return clase;
    },

    borrarClase(id) {
        const db = this._leer();
        db.clases = db.clases.filter(c => c.id !== id);
        this._guardar(db);
    },

    /* ---------- Mensajes del formulario de contacto ---------- */
    guardarMensaje(datos) {
        const db = this._leer();
        db.mensajes.push({ id: this.uid(), fecha: new Date().toISOString(), ...datos });
        this._guardar(db);
    },

    listarMensajes() {
        return this._leer().mensajes.slice().reverse();
    },

    borrarMensaje(id) {
        const db = this._leer();
        db.mensajes = db.mensajes.filter(m => m.id !== id);
        this._guardar(db);
    }
};

/* Escapa texto antes de meterlo en innerHTML.
   Sin esto, alguien podría escribir <script> en un apunte y
   ejecutarlo (ataque XSS). Se usa en todas las vistas. */
function esc(texto) {
    const d = document.createElement('div');
    d.textContent = texto ?? '';
    return d.innerHTML;
}
