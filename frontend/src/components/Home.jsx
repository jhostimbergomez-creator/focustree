import ContactForm from './ContactForm.jsx'

// Datos de las tarjetas: se pintan con .map() en vez de repetir el mismo HTML tres veces
const TARJETAS = [
  { titulo: 'Organiza tus estudios', texto: 'Crea una categoría por cada cosa que estudias: Java, inglés, universidad, electrónica.' },
  { titulo: 'Guarda todo lo que aprendes', texto: 'Cada clase registra fecha, tema, lo que aprendiste y lo que aún no entiendes.' },
  { titulo: 'Consulta tus apuntes con IA', texto: 'Resume una clase, genera preguntas de estudio o pregunta sobre tus notas. La IA usa un modelo de Google (Gemini).' }
]

const DETALLES = [
  { titulo: 'Guardar notas', texto: 'Escribe cada clase con sus dudas y quedan ordenadas por categoría.', abierto: true },
  { titulo: 'Preguntar a la IA', texto: 'La IA responde solo con tus apuntes, no con información de internet.' },
  { titulo: 'Ver tu progreso', texto: 'Cada clase muestra si quedó algo pendiente por entender.' }
]

const BENEFICIOS = [
  'Organiza tus apuntes en un solo lugar',
  'Detecta lo que todavía no entiendes',
  'Repasa con preguntas hechas desde tus notas'
]

function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="contenedor hero" id="bienvenida">
        <div>
          <h1>Organiza lo que aprendes, no lo que olvidas</h1>
          <p>Guarda cada clase en su categoría y pregúntale a una IA que solo conoce lo que tú escribiste.</p>
          <a href="#/dashboard" className="btn">Comenzar</a>
        </div>

        {/* Ejemplo visual de una clase: enseña el producto sin explicarlo */}
        <aside className="ejemplo" aria-label="Ejemplo de una clase guardada">
          <small>Java · 14 de octubre</small>
          <h3>Herencia y polimorfismo</h3>
          <dl>
            <dt>Qué aprendí</dt>
            <dd>Una subclase reutiliza los métodos de la clase padre.</dd>
            <dt>Qué no entendí</dt>
            <dd>Cuándo usar una interfaz en vez de una clase abstracta.</dd>
          </dl>
          <div className="ia-burbuja">Todavía no tienes claro este punto. Repasa interfaces antes de tu próxima clase.</div>
        </aside>
      </section>

      {/* TRES TARJETAS */}
      <section className="contenedor seccion" id="que-es">
        <div className="tarjetas">
          {TARJETAS.map((t) => (
            <article className="tarjeta" key={t.titulo}>
              <h3>{t.titulo}</h3>
              <p>{t.texto}</p>
            </article>
          ))}
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section className="contenedor seccion" id="about-us">
        <h2>Sobre nosotros</h2>
        <p className="intro">Focustree nace para quien estudia muchas cosas a la vez y no quiere perder el hilo de su propio aprendizaje.</p>
        <div className="about">
          <div>
            {DETALLES.map((d) => (
              <details key={d.titulo} open={d.abierto}>
                <summary>{d.titulo}</summary>
                <p>{d.texto}</p>
              </details>
            ))}
          </div>
          <div>
            <h3>Para quién es</h3>
            <p className="intro">Estudiantes autodidactas que quieren seguir su avance con claridad.</p>
            <ul>
              {BENEFICIOS.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="contenedor seccion" id="contacto">
        <h2>Contacto</h2>
        <p className="intro">Escríbenos y te respondemos lo antes posible.</p>
        <div className="contacto-caja">
          <ContactForm />
          <p className="aviso-modo">
            Los mensajes se guardan en la base de datos (MongoDB).
          </p>
        </div>
      </section>
    </main>
  )
}

export default Home
