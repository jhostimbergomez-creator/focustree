const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const TOKEN_KEY = 'focustree_token'

export const sesionActiva = () => Boolean(sessionStorage.getItem(TOKEN_KEY))
export const cerrarSesion = () => sessionStorage.removeItem(TOKEN_KEY)

async function pedir(ruta, { metodo = 'GET', cuerpo, auth = false } = {}) {
  const headers = {}
  if (cuerpo !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) headers.Authorization = `Bearer ${sessionStorage.getItem(TOKEN_KEY)}`

  let res
  try {
    res = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Si está en Render gratis, puede estar despertando: espera un minuto e intenta de nuevo.')
  }

  const datos = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401) cerrarSesion()
    const error = new Error(datos.error || 'Algo salió mal. Intenta de nuevo.')
    error.status = res.status
    throw error
  }
  return datos
}

export const api = {
  listarCategorias: () => pedir('/api/categorias'),
  crearCategoria: (nombre) => pedir('/api/categorias', { metodo: 'POST', cuerpo: { nombre } }),
  borrarCategoria: (id) => pedir(`/api/categorias/${id}`, { metodo: 'DELETE' }),

  listarClases: () => pedir('/api/clases'),
  crearClase: (datos) => pedir('/api/clases', { metodo: 'POST', cuerpo: datos }),
  borrarClase: (id) => pedir(`/api/clases/${id}`, { metodo: 'DELETE' }),

  enviarMensaje: (datos) => pedir('/api/mensajes', { metodo: 'POST', cuerpo: datos }),
  listarMensajes: () => pedir('/api/mensajes', { auth: true }),
  borrarMensaje: (id) => pedir(`/api/mensajes/${id}`, { metodo: 'DELETE', auth: true }),

  async preguntarIA(datos) {
    const { respuesta } = await pedir('/api/ia', { metodo: 'POST', cuerpo: datos })
    return respuesta
  },

  async login(usuario, clave) {
    const { token } = await pedir('/api/auth/login', { metodo: 'POST', cuerpo: { usuario, clave } })
    sessionStorage.setItem(TOKEN_KEY, token)
  }
}
