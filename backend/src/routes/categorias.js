import { Router } from 'express'
import Categoria from '../models/Categoria.js'
import Clase from '../models/Clase.js'

const router = Router()

router.get('/', async (req, res) => {
  const lista = await Categoria.find().sort({ nombre: 1 })
  res.json(lista)
})

router.post('/', async (req, res) => {
  const categoria = await Categoria.create({ nombre: req.body?.nombre })
  res.status(201).json(categoria)
})

router.delete('/:id', async (req, res) => {
  const borrada = await Categoria.findByIdAndDelete(req.params.id)
  if (!borrada) return res.status(404).json({ error: 'La categoría no existe' })
  await Clase.deleteMany({ categoriaId: req.params.id })
  res.json({ ok: true })
})

export default router
