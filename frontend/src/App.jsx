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
  return 'home' 
}

function App() {
  const [vista, setVista] = useState(leerVista)

  useEffect(() => {
    const alCambiar = () => setVista(leerVista())
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar) 
  }, [])

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
