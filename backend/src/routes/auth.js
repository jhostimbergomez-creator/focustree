import { Router } from 'express'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/login', (req, res) => {
  const { usuario, clave } = req.body ?? {}

  if (usuario !== process.env.ADMIN_USER || clave !== process.env.ADMIN_PASS) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' })
  }
  const token = jwt.sign({ rol: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' })
  res.json({ token })
})

export default router
