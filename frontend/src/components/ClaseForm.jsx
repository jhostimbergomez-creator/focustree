import { useState } from 'react'
import { hoy } from '../utils.js'

const vacio = () => ({ fecha: hoy(), tema: '', aprendi: '', noEntendi: '', notas: '' })

// Formulario para crear una clase. No guarda nada por sí mismo: llama a onGuardar (lo recibe por props).
function ClaseForm({ onGuardar }) {
  const [abierto, setAbierto] = useState(false)
  const [datos, setDatos] = useState(vacio)
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  const cambiar = (e) => setDatos((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  async function enviar(e) {
    e.preventDefault()
    const limpio = {
      fecha: datos.fecha,
      tema: datos.tema.trim(),
      aprendi: datos.aprendi.trim(),
      noEntendi: datos.noEntendi.trim(),
      notas: datos.notas.trim()
    }
    if (!limpio.fecha) return setError('Elige una fecha.')
    if (limpio.tema.length < 3) return setError('El tema necesita al menos 3 letras.')
    if (limpio.aprendi.length < 5) return setError('Cuenta qué aprendiste (mínimo 5 letras).')

    setGuardando(true)
    setError('')
    try {
      await onGuardar(limpio)
      setDatos(vacio()) // limpia el formulario
      setAbierto(false) // y lo cierra
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="desplegable">
      <button type="button" className="btn btn-chico" aria-expanded={abierto} onClick={() => setAbierto(!abierto)}>
        {abierto ? 'Cancelar' : '+ Nueva clase'}
      </button>

      {abierto && (
        <form onSubmit={enviar} noValidate style={{ marginTop: '1rem' }}>
          <label htmlFor="c-fecha">Fecha</label>
          <input type="date" id="c-fecha" name="fecha" value={datos.fecha} onChange={cambiar} />

          <label htmlFor="c-tema">Tema</label>
          <input type="text" id="c-tema" name="tema" placeholder="Ej: Herencia en Java" maxLength={80}
                 value={datos.tema} onChange={cambiar} />

          <label htmlFor="c-aprendi">Qué aprendí</label>
          <textarea id="c-aprendi" name="aprendi" rows="3" placeholder="Una idea por línea o separadas por punto"
                    value={datos.aprendi} onChange={cambiar} />

          <label htmlFor="c-no">Qué no entendí</label>
          <textarea id="c-no" name="noEntendi" rows="2" placeholder="Déjalo vacío si entendiste todo"
                    value={datos.noEntendi} onChange={cambiar} />

          <label htmlFor="c-notas">Notas</label>
          <textarea id="c-notas" name="notas" rows="2" value={datos.notas} onChange={cambiar} />

          <button type="submit" className="btn" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar clase'}
          </button>
          <p className="mensaje error" role="alert">{error}</p>
        </form>
      )}
    </div>
  )
}

export default ClaseForm
