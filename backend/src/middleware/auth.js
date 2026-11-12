import jwt from 'jsonwebtoken'

export function requerirAdmin(req, res, next) {
  const cabecera = req.headers.authorization || ''
  const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Necesitas iniciar sesión' })

  try {
    jwt.verify(token, process.env.JWT_SECRET) 
    next() 
  } catch {
    res.status(401).json({ error: 'Sesión inválida o vencida. Entra de nuevo.' })
  }
}
