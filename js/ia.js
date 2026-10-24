/* ==========================================================
   ia.js – IA PERSONALIZADA (local)
   ----------------------------------------------------------
   Una IA real (OpenAI, etc.) necesita una API key. Si la pones
   en un archivo de GitHub Pages, cualquiera puede robarla.
   Por eso aquí la "IA" es un motor de texto que trabaja SOLO
   con lo que tú escribiste: exactamente lo que pedía tu idea.

   Todas las funciones reciben datos y devuelven texto. No tocan
   el DOM, así que luego puedes reemplazar el cuerpo por un
   fetch() a un backend que llame a una IA real.
   ========================================================== */

const IA = {
    // Palabras que no aportan al buscar ("de", "el", "que"...)
    _vacias: new Set(['de', 'la', 'el', 'los', 'las', 'un', 'una', 'que', 'qué', 'como', 'cómo',
        'es', 'en', 'y', 'o', 'por', 'para', 'con', 'se', 'del', 'al', 'mi', 'me', 'lo', 'su',
        'sobre', 'cuando', 'cuándo', 'son', 'no', 'si', 'sí']),

    // Parte un texto largo en ideas sueltas (por punto, salto de línea o ;)
    _ideas(texto) {
        return (texto || '')
            .split(/[.\n;]+/)
            .map(s => s.trim())
            .filter(s => s.length > 3);
    },

    /* ---------- 1. Resumir una clase ---------- */
    resumir(clase) {
        const aprendido = this._ideas(clase.aprendi);
        const pendiente = this._ideas(clase.noEntendi);

        let r = `Resumen de «${clase.tema}» (${clase.fecha})\n\n`;
        r += aprendido.length
            ? 'Lo que ya sabes:\n' + aprendido.map(i => '• ' + i).join('\n')
            : 'No registraste qué aprendiste en esta clase.';
        r += '\n\n';
        r += pendiente.length
            ? 'Lo que falta por entender:\n' + pendiente.map(i => '• ' + i).join('\n')
            : 'No quedó nada pendiente. Buen trabajo.';
        if (clase.notas && clase.notas.trim()) r += '\n\nNotas extra: ' + clase.notas.trim();
        return r;
    },

    /* ---------- 2. Generar preguntas de estudio ---------- */
    preguntas(clase) {
        const aprendido = this._ideas(clase.aprendi);
        const pendiente = this._ideas(clase.noEntendi);
        // Plantillas que se van alternando para que no sean todas iguales
        const plantillas = [
            i => `Explica con tus palabras: «${i}».`,
            i => `¿Por qué es cierto que «${i}»? Da un ejemplo.`,
            i => `¿Qué pasaría si «${i}» no se cumpliera?`
        ];

        const lista = [];
        aprendido.forEach((idea, n) => lista.push(plantillas[n % plantillas.length](idea)));
        pendiente.forEach(idea => lista.push(`Pendiente: ¿qué parte exacta de «${idea}» te confunde? Escríbelo en una frase.`));

        if (!lista.length) return 'Esta clase no tiene contenido suficiente. Agrega qué aprendiste y qué no entendiste.';
        return `Preguntas para repasar «${clase.tema}»:\n\n` + lista.map((p, n) => `${n + 1}. ${p}`).join('\n');
    },

    /* ---------- 3. Preguntar a tus apuntes (búsqueda) ---------- */
    // Puntúa cada clase según cuántas palabras de tu pregunta contiene
    preguntar(pregunta, clases) {
        const palabras = pregunta.toLowerCase()
            .split(/[^a-záéíóúñü0-9]+/)
            .filter(p => p.length > 2 && !this._vacias.has(p));

        if (!palabras.length) return 'Escribe una pregunta con alguna palabra clave, por ejemplo: «herencia».';

        const puntuadas = clases.map(c => {
            const texto = `${c.tema} ${c.aprendi} ${c.noEntendi} ${c.notas}`.toLowerCase();
            const puntos = palabras.reduce((suma, p) => suma + (texto.includes(p) ? 1 : 0), 0);
            return { clase: c, puntos };
        }).filter(x => x.puntos > 0).sort((a, b) => b.puntos - a.puntos).slice(0, 3);

        if (!puntuadas.length) {
            return 'No encontré nada sobre eso en tus apuntes. Si lo estudiaste, agrégalo en una clase nueva.';
        }

        return 'Esto es lo que escribiste sobre ese tema:\n\n' + puntuadas.map(({ clase }) => {
            let t = `• ${clase.tema} (${clase.fecha})\n  Aprendiste: ${clase.aprendi || '—'}`;
            if (clase.noEntendi && clase.noEntendi.trim()) t += `\n  Te faltaba entender: ${clase.noEntendi}`;
            return t;
        }).join('\n\n');
    },

    /* ---------- 4. Detectar vacíos (fase 2) ---------- */
    vacios(clases) {
        const pendientes = clases.filter(c => c.noEntendi && c.noEntendi.trim());
        if (!pendientes.length) return 'No detecto vacíos en esta categoría. Sigue registrando tus clases.';
        return 'Creo que todavía no dominas estos temas:\n\n' +
            pendientes.map(c => `• ${c.tema}: ${c.noEntendi}`).join('\n') +
            '\n\nEmpieza por el más antiguo.';
    }
};
