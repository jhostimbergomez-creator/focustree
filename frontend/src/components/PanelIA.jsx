import { useState } from 'react'
import { api } from '../api'

// Panel de IA dentro de una clase abierta
function PanelIA({ clase }) {
  const [pregunta, setPregunta] = useState('')
  const [salida, setSalida] = useState(null) // texto de la respuesta, o null si no hay
  const [pensando, setPensando] = useState(false)

  // Pide a la IA lo que indique `datos` y muestra la respuesta (o el error)
  async function consultar(datos) {
    setPensando(true)
    setSalida(null)
    try {
      setSalida(await api.preguntarIA(datos))
    } catch (err) {
      setSalida(err.message)
    } finally {
      setPensando(false) // pase lo que pase, se quita "Pensando…"
    }
  }

  function preguntar(e) {
    e.preventDefault()
    const q = pregunta.trim()
    if (!q) return setSalida('Escribe una pregunta primero.')
    consultar({ accion: 'preguntar', categoriaId: clase.categoriaId, pregunta: q })
  }

  return (
    <div className="ia-panel">
      <h4>IA con tus apuntes</h4>
      <div className="ia-botones">
        <button className="btn btn-chico" disabled={pensando}
                onClick={() => consultar({ accion: 'resumir', claseId: clase._id })}>
          Resumir esta clase
        </button>
        <button className="btn btn-chico" disabled={pensando}
                onClick={() => consultar({ accion: 'preguntas', claseId: clase._id })}>
          Generar preguntas de estudio
        </button>
      </div>

      <form className="form-inline" onSubmit={preguntar} noValidate>
        <label htmlFor="pregunta" className="sr-only">Pregunta sobre esta categoría</label>
        <input type="text" id="pregunta" placeholder="Pregunta algo sobre esta categoría"
               maxLength={300} value={pregunta} onChange={(e) => setPregunta(e.target.value)} />
        <button type="submit" className="btn btn-chico" disabled={pensando}>Preguntar</button>
      </form>

      <div className={'ia-salida' + (pensando ? ' cargando' : '')} style={{ marginTop: '.8rem' }} aria-live="polite">
        {pensando ? 'Pensando…' : salida ?? 'Elige una acción para empezar.'}
      </div>
    </div>
  )
}

export default PanelIA
