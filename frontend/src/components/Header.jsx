// Barra superior. Cambia sus enlaces según la pantalla en que estemos.
function Header({ vista }) {
  const enHome = vista === 'home'

  return (
    <header className="barra">
      <div className="contenedor">
        <a className="logo" href="#/">Focus<span>tree</span></a>
        <nav aria-label="Navegación principal">
          {enHome ? (
            <>
              <a href="#que-es">Qué es</a>
              <a href="#about-us">Sobre nosotros</a>
              <a href="#contacto">Contacto</a>
              <a href="#/dashboard">Dashboard</a>
            </>
          ) : (
            <>
              <a href="#/">Inicio</a>
              <a href="#/dashboard" aria-current={vista === 'dashboard' ? 'page' : undefined}>Dashboard</a>
              <a href="#/admin" aria-current={vista === 'admin' ? 'page' : undefined}>Admin</a>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
