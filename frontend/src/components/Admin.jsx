import { useEffect, useState } from 'react'
import { api, sesionActiva, cerrarSesion } from '../api'

function Admin() {
  const [sesion, setSesion] = useState(sesionActiva())

  function salir() {
    cerrarSesion()
    setSesion(false)
  }

  return (
    <main className="contenedor">
      {sesion
        ? <Panel onSalir={salir} />
        : <Login onEntrar={() => setSesion(true)} />}
    </main>
  )
}

function Login({ onEntrar }) {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [entrando, setEntrando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    if (!usuario.trim() || !clave) return setError('Escribe tu usuario y tu contraseña.')
    setEntrando(true)
    setError('')
    try {
      await api.login(usuario.trim(), clave)
      onEntrar()
    } catch (err) {
      setError(err.message)
      setEntrando(false)
    }
  }

  return (
    <section className="panel login-caja">
      <h2>Acceso de administrador</h2>
      <form onSubmit={enviar} noValidate>
        <label htmlFor="usuario">Usuario</label>
        <input type="text" id="usuario" autoComplete="username"
               value={usuario} onChange={(e) => setUsuario(e.target.value)} />
        <label htmlFor="clave">Contraseña</label>
        <input type="password" id="clave" autoComplete="current-password"
               value={clave} onChange={(e) => setClave(e.target.value)} />
        <button type="submit" className="btn" disabled={entrando}>{entrando ? 'Entrando…' : 'Entrar'}</button>
        <p className="mensaje error" role="alert">{error}</p>
      </form>
    </section>
  )
}

function Panel({ onSalir }) {
  const [datos, setDatos] = useState(null) 
  const [error, setError] = useState('')

  async function cargar() {
    setError('')
    try {
      const [categorias, clases, mensajes] = await Promise.all([
        api.listarCategorias(), api.listarClases(), api.listarMensajes()
      ])
      setDatos({ categorias, clases, mensajes })
    } catch (err) {
      if (err.status === 401) return onSalir() 
      setError(err.message)
    }
  }

  useEffect(() => { cargar() }, [])

  async function borrar(id) {
    if (!confirm('¿Borrar este mensaje?')) return
    try {
      await api.borrarMensaje(id)
      setDatos((prev) => ({ ...prev, mensajes: prev.mensajes.filter((m) => m._id !== id) }))
    } catch (err) {
      if (err.status === 401) return onSalir()
      setError(err.message)
    }
  }

  return (
    <section style={{ paddingTop: '1.5rem' }}>
      <div className="cabecera-cat">
        <h2>Panel de administración</h2>
        <button className="btn btn-sec btn-chico" onClick={onSalir}>Cerrar sesión</button>
      </div>

      {error && (
        <div className="vacio" role="alert">
          <strong>No pudimos cargar el panel</strong>{error}
          <div style={{ marginTop: '1rem' }}><button className="btn btn-chico" onClick={cargar}>Reintentar</button></div>
        </div>
      )}
      {!datos && !error && <p className="mensaje" role="status">Cargando…</p>}

      {datos && (
        <>
          <div className="stats">
            <div className="stat"><b>{datos.categorias.length}</b>categorías</div>
            <div className="stat"><b>{datos.clases.length}</b>clases guardadas</div>
            <div className="stat"><b>{datos.mensajes.length}</b>mensajes recibidos</div>
          </div>

          <div className="panel">
            <h2>Mensajes de contacto</h2>
            {datos.mensajes.length ? datos.mensajes.map((m) => (
              <article className="msg-item" key={m._id}>
                <header>
                  <strong>{m.nombre} <small>{m.email}</small></strong>
                  <small>{new Date(m.createdAt).toLocaleString('es-CO')}</small>
                </header>
                <p>{m.mensaje}</p>
                <button className="btn btn-peligro btn-chico" style={{ marginTop: '.6rem' }}
                        onClick={() => borrar(m._id)}>Borrar</button>
              </article>
            )) : (
              <div className="vacio"><strong>Sin mensajes todavía</strong>Los mensajes del formulario de contacto aparecerán aquí.</div>
            )}
          </div>
        </>
      )}
    </section>
  )
}

export default Admin
