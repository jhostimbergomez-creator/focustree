// Middleware: función que corre ANTES de la ruta. Si no hay token válido, corta aquí con 401.
import jwt from 'jsonwebtoken'

export function requerirAdmin(req, res, next) {
  const cabecera = req.headers.authorization || ''
  const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Necesitas iniciar sesión' })

  try {
    jwt.verify(token, process.env.JWT_SECRET) // lanza error si está vencido o alterado
    next() // token válido: continúa hacia la ruta
  } catch {
    res.status(401).json({ error: 'Sesión inválida o vencida. Entra de nuevo.' })
  }
}
