/* ==========================================================
   App.jsx – componente raíz
   Decide qué pantalla mostrar según la parte final de la URL (el "hash"):
     #/            -> Home
     #/dashboard   -> Dashboard
     #/admin       -> Admin
   Se usa el hash (y no una librería de rutas) porque GitHub Pages solo sirve
   archivos estáticos: con rutas normales, recargar /dashboard daría error 404.
   ========================================================== */
import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './components/Home.jsx'
import Dashboard from './components/Dashboard.jsx'
import Admin from './components/Admin.jsx'

const TITULOS = {
  home: 'Focustree – Organiza lo que aprendes',
  dashboard: 'Dashboard – Focustree',
  admin: 'Admin – Focustree'
}

function leerVista() {
  const hash = window.location.hash
  if (hash.startsWith('#/dashboard')) return 'dashboard'
  if (hash.startsWith('#/admin')) return 'admin'
  return 'home' // incluye '#/', '' y anclas internas como '#contacto'
}

function App() {
  const [vista, setVista] = useState(leerVista)

  // Escucha los cambios de URL (clic en un enlace, botones atrás/adelante)
  useEffect(() => {
    const alCambiar = () => setVista(leerVista())
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar) // limpieza al desmontar
  }, [])

  // Al cambiar de pantalla: título de la pestaña y volver arriba
  useEffect(() => {
    document.title = TITULOS[vista]
    window.scrollTo(0, 0)
  }, [vista])

  return (
    <>
      <Header vista={vista} />
      {vista === 'home' && <Home />}
      {vista === 'dashboard' && <Dashboard />}
      {vista === 'admin' && <Admin />}
      {vista === 'home' && <Footer />}
    </>
  )
}

export default App
