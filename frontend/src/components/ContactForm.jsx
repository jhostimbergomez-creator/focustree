import { useState } from 'react'
import { api } from '../api'

// Devuelve un texto de error, o '' si todo está bien
function validar({ nombre, email, mensaje }) {
  if (nombre.length < 2) return 'Escribe tu nombre (mínimo 2 letras).'
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'El correo no es válido. Ejemplo: tu@email.com'
  if (mensaje.length < 10) return 'El mensaje es muy corto. Cuéntanos un poco más.'
  return ''
}

function ContactForm() {
  // Inputs controlados: React guarda lo que escribe el usuario en este estado
  const [datos, setDatos] = useState({ nombre: '', email: '', mensaje: '' })
  const [aviso, setAviso] = useState({ texto: '', tipo: '' }) // tipo: 'ok' | 'error' | ''
  const [enviando, setEnviando] = useState(false)

  // e.target.name coincide con la clave del estado: un solo manejador para los 3 campos
  const cambiar = (e) => setDatos((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  async function enviar(e) {
    e.preventDefault() // evita que la página se recargue

    const limpio = {
      nombre: datos.nombre.trim(),
      email: datos.email.trim(),
      mensaje: datos.mensaje.trim()
    }
    const error = validar(limpio)
    if (error) return setAviso({ texto: error, tipo: 'error' })

    setEnviando(true) // estado de carga
    setAviso({ texto: 'Enviando…', tipo: '' })
    try {
      await api.enviarMensaje(limpio)
      setAviso({ texto: `Gracias, ${limpio.nombre}. Recibimos tu mensaje.`, tipo: 'ok' })
      setDatos({ nombre: '', email: '', mensaje: '' })
    } catch (err) {
      setAviso({ texto: err.message, tipo: 'error' })
    } finally {
      setEnviando(false) // pase lo que pase, se reactiva el botón
    }
  }

  return (
    <form onSubmit={enviar} noValidate>
      <label htmlFor="nombre">Nombre</label>
      <input type="text" id="nombre" name="nombre" placeholder="Tu nombre"
             value={datos.nombre} onChange={cambiar} maxLength={80} />

      <label htmlFor="email">Correo electrónico</label>
      <input type="email" id="email" name="email" placeholder="tu@email.com"
             value={datos.email} onChange={cambiar} />

      <label htmlFor="mensaje">Mensaje</label>
      <textarea id="mensaje" name="mensaje" rows="4" placeholder="Escribe tu mensaje"
                value={datos.mensaje} onChange={cambiar} maxLength={1000} />

      <button type="submit" className="btn" disabled={enviando}>Enviar mensaje</button>
      <p className={`mensaje ${aviso.tipo}`} role="status" aria-live="polite">{aviso.texto}</p>
    </form>
  )
}

export default ContactForm
