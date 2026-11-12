import { useState } from 'react'
import { api } from '../api'

function DetectarVacios({ categoriaId }) {
  const [salida, setSalida] = useState(null)
  const [pensando, setPensando] = useState(false)

  async function detectar() {
    setPensando(true)
    setSalida(null)
    try {
      setSalida(await api.preguntarIA({ accion: 'vacios', categoriaId }))
    } catch (err) {
      setSalida(err.message)
    } finally {
      setPensando(false)
    }
  }

  return (
    <>
      <button className="btn btn-sec btn-chico" disabled={pensando} onClick={detectar}>
        Detectar vacíos
      </button>
      {(pensando || salida) && (
        <div className={'ia-salida' + (pensando ? ' cargando' : '')}
             style={{ flexBasis: '100%', marginTop: '.8rem' }} aria-live="polite">
          {pensando ? 'Pensando…' : salida}
        </div>
      )}
    </>
  )
}

export default DetectarVacios
