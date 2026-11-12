import { Router } from 'express'
import Categoria from '../models/Categoria.js'
import Clase from '../models/Clase.js'

const router = Router()

router.get('/', async (req, res) => {
  res.json(await Clase.find().sort({ fecha: -1, createdAt: -1 }))
})

router.post('/', async (req, res) => {
  const { categoriaId, fecha, tema, aprendi, noEntendi, notas } = req.body ?? {}

  if (!(await Categoria.exists({ _id: categoriaId }))) {
    return res.status(404).json({ error: 'La categoría no existe' })
  }
  const clase = await Clase.create({ categoriaId, fecha, tema, aprendi, noEntendi, notas })
  res.status(201).json(clase)
})

router.delete('/:id', async (req, res) => {
  const borrada = await Clase.findByIdAndDelete(req.params.id)
  if (!borrada) return res.status(404).json({ error: 'La clase no existe' })
  res.json({ ok: true })
})

export default router
