import PanelIA from './PanelIA.jsx'

function Bloque({ titulo, texto }) {
  if (!texto || !texto.trim()) return null
  return (
    <div className="bloque">
      <h4>{titulo}</h4>
      <p>{texto}</p>
    </div>
  )
}


function ClaseDetalle({ clase, onVolver, onBorrar }) {
  return (
    <>
      <div className="cabecera-cat">
        <button className="btn btn-sec btn-chico" onClick={onVolver}>Volver</button>
        <button className="btn btn-peligro btn-chico" onClick={() => onBorrar(clase._id)}>Borrar clase</button>
      </div>

      <div className="detalle">
        <small>{clase.fecha}</small>
        <h3>{clase.tema}</h3>
        <Bloque titulo="Qué aprendí" texto={clase.aprendi} />
        <Bloque titulo="Qué no entendí" texto={clase.noEntendi} />
        <Bloque titulo="Notas" texto={clase.notas} />
      </div>

      <PanelIA clase={clase} />
    </>
  )
}

export default ClaseDetalle
