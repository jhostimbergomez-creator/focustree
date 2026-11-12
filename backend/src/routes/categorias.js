import { Router } from 'express'
import Categoria from '../models/Categoria.js'
import Clase from '../models/Clase.js'

const router = Router()

// GET /api/categorias -> lista ordenada alfabéticamente
router.get('/', async (req, res) => {
  const lista = await Categoria.find().sort({ nombre: 1 })
  res.json(lista)
})

// POST /api/categorias { nombre } -> crea una categoría
router.post('/', async (req, res) => {
  const categoria = await Categoria.create({ nombre: req.body?.nombre })
  res.status(201).json(categoria)
})

// DELETE /api/categorias/:id -> borra la categoría y todas sus clases
router.delete('/:id', async (req, res) => {
  const borrada = await Categoria.findByIdAndDelete(req.params.id)
  if (!borrada) return res.status(404).json({ error: 'La categoría no existe' })
  await Clase.deleteMany({ categoriaId: req.params.id })
  res.json({ ok: true })
})

export default router
