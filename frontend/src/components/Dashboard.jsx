import { useEffect, useState } from 'react'
import { api } from '../api'
import ClaseForm from './ClaseForm.jsx'
import ClaseDetalle from './ClaseDetalle.jsx'
import DetectarVacios from './DetectarVacios.jsx'

function Dashboard() {
  const [categorias, setCategorias] = useState([])
  const [clases, setClases] = useState([])
  const [catId, setCatId] = useState(null)
  const [claseId, setClaseId] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [aviso, setAviso] = useState('') 
  const [nuevaCat, setNuevaCat] = useState('')
  const [errorCat, setErrorCat] = useState('')

  async function cargar() {
    setCargando(true)
    setErrorCarga('')
    try {
      const [cats, cls] = await Promise.all([api.listarCategorias(), api.listarClases()])
      setCategorias(cats)
      setClases(cls)
      if (cats.length) setCatId(cats[0]._id) 
    } catch (err) {
      setErrorCarga(err.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const categoria = categorias.find((c) => c._id === catId)
  const clasesCategoria = clases.filter((c) => c.categoriaId === catId)
  const claseActual = clasesCategoria.find((c) => c._id === claseId)
  async function crearCategoria(e) {
    e.preventDefault()
    const nombre = nuevaCat.trim()
    if (nombre.length < 2) return setErrorCat('Escribe un nombre de al menos 2 letras.')
    if (categorias.some((c) => c.nombre.toLowerCase() === nombre.toLowerCase())) {
      return setErrorCat('Esa categoría ya existe.')
    }
    try {
      const nueva = await api.crearCategoria(nombre)
      setCategorias((prev) => [...prev, nueva]) 
      setCatId(nueva._id)
      setClaseId(null)
      setNuevaCat('')
      setErrorCat('')
    } catch (err) {
      setErrorCat(err.message)
    }
  }

  async function borrarCategoria() {
    if (!confirm('¿Borrar la categoría y todas sus clases?')) return
    try {
      await api.borrarCategoria(catId)
      setCategorias((prev) => prev.filter((c) => c._id !== catId))
      setClases((prev) => prev.filter((c) => c.categoriaId !== catId))
      setCatId(null)
      setClaseId(null)
      setAviso('')
    } catch (err) {
      setAviso(err.message)
    }
  }

  async function guardarClase(datos) {
    const nueva = await api.crearClase({ ...datos, categoriaId: catId })
    setClases((prev) => [nueva, ...prev])
  }

  async function borrarClase(id) {
    if (!confirm('¿Borrar esta clase? No se puede deshacer.')) return
    try {
      await api.borrarClase(id)
      setClases((prev) => prev.filter((c) => c._id !== id))
      setClaseId(null)
      setAviso('')
    } catch (err) {
      setAviso(err.message)
    }
  }

  function elegirCategoria(id) {
    setCatId(id)
    setClaseId(null)
    setAviso('')
  }

  function contenidoArea() {
    if (cargando) return <p className="mensaje" role="status">Cargando tus datos…</p>

    if (errorCarga) {
      return (
        <div className="vacio" role="alert">
          <strong>No pudimos cargar tus datos</strong>
          {errorCarga}
          <div style={{ marginTop: '1rem' }}>
            <button className="btn btn-chico" onClick={cargar}>Reintentar</button>
          </div>
        </div>
      )
    }

    if (!categorias.length) {
      return <div className="vacio"><strong>Aún no tienes categorías</strong>Crea la primera a la izquierda, por ejemplo «Java» o «Inglés».</div>
    }
    if (!categoria) {
      return <div className="vacio"><strong>Elige una categoría</strong>Verás sus clases aquí.</div>
    }
    if (claseActual) {
      return (
        <ClaseDetalle clase={claseActual}
                      onVolver={() => setClaseId(null)} onBorrar={borrarClase} />
      )
    }

    return (
      <>
        <div className="cabecera-cat">
          <h2>{categoria.nombre}</h2>
          <div className="fila-acciones">
            <DetectarVacios key={catId} categoriaId={catId} />
            <button className="btn btn-peligro btn-chico" onClick={borrarCategoria}>Borrar categoría</button>
          </div>
        </div>

        <ClaseForm onGuardar={guardarClase} />

        {clasesCategoria.length ? (
          <div className="grid-clases" style={{ marginTop: '1rem' }}>
            {clasesCategoria.map((c) => (
              <button className="clase-card" key={c._id} onClick={() => setClaseId(c._id)}>
                <small>{c.fecha}</small>
                <h3>{c.tema}</h3>
                {c.noEntendi && c.noEntendi.trim()
                  ? <span className="etiqueta-pend">Tiene dudas pendientes</span>
                  : <span className="etiqueta-ok">Todo entendido</span>}
              </button>
            ))}
          </div>
        ) : (
          <div className="vacio" style={{ marginTop: '1rem' }}>
            <strong>Esta categoría no tiene clases</strong>Abre «Nueva clase» y registra la primera.
          </div>
        )}
      </>
    )
  }

  return (
    <main className="contenedor espacio">
      <aside className="panel" aria-label="Categorías">
        <h2>Categorías</h2>
        <ul className="lista-cats">
          {categorias.map((c) => (
            <li key={c._id}>
              <button className={'cat-btn' + (c._id === catId ? ' activa' : '')}
                      aria-pressed={c._id === catId} onClick={() => elegirCategoria(c._id)}>
                <span>{c.nombre}</span>
                <span className="num">{clases.filter((cl) => cl.categoriaId === c._id).length}</span>
              </button>
            </li>
          ))}
        </ul>

        <form className="form-inline" onSubmit={crearCategoria} noValidate>
          <label htmlFor="nueva-cat" className="sr-only">Nombre de la categoría</label>
          <input type="text" id="nueva-cat" placeholder="Ej: Java" maxLength={30}
                 value={nuevaCat} onChange={(e) => setNuevaCat(e.target.value)} />
          <button type="submit" className="btn btn-chico">+ Nueva</button>
        </form>
        <p className="mensaje error" role="alert">{errorCat}</p>
      </aside>
      <section className="panel" aria-live="polite">
        {aviso && <p className="mensaje error" role="alert">{aviso}</p>}
        {contenidoArea()}
      </section>
    </main>
  )
}

export default Dashboard
