import { Router } from 'express'
import Mensaje from '../models/Mensaje.js'
import { requerirAdmin } from '../middleware/auth.js'

const router = Router()

// POST /api/mensajes -> PÚBLICO: cualquier visitante envía el formulario de contacto
router.post('/', async (req, res) => {
  const { nombre, email, mensaje } = req.body ?? {}
  const creado = await Mensaje.create({ nombre, email, mensaje })
  res.status(201).json({ ok: true, id: creado._id })
})

// GET y DELETE -> PRIVADOS: pasan primero por requerirAdmin
router.get('/', requerirAdmin, async (req, res) => {
  res.json(await Mensaje.find().sort({ createdAt: -1 }))
})

router.delete('/:id', requerirAdmin, async (req, res) => {
  const borrado = await Mensaje.findByIdAndDelete(req.params.id)
  if (!borrado) return res.status(404).json({ error: 'El mensaje no existe' })
  res.json({ ok: true })
})

export default router
