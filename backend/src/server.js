import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import auth from './routes/auth.js'
import categorias from './routes/categorias.js'
import clases from './routes/clases.js'
import mensajes from './routes/mensajes.js'
import ia from './routes/ia.js'

const requeridas = ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_USER', 'ADMIN_PASS', 'FRONTEND_ORIGIN', 'GEMINI_API_KEY', 'GEMINI_MODEL']
const faltan = requeridas.filter((nombre) => !process.env[nombre])
if (faltan.length) {
  console.error(`Faltan variables de entorno: ${faltan.join(', ')}. Mira backend/.env.example.`)
  process.exit(1)
}

const app = express()

app.use(cors({ origin: process.env.FRONTEND_ORIGIN }))
app.use(express.json({ limit: '50kb' })) 

app.use('/api/auth', auth)
app.use('/api/categorias', categorias)
app.use('/api/clases', clases)
app.use('/api/mensajes', mensajes)
app.use('/api/ia', ia)

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: Object.values(err.errors)[0].message }) 
  }
  if (err.code === 11000) return res.status(409).json({ error: 'Ese registro ya existe' }) // nombre repetido
  console.error(err) 
  res.status(500).json({ error: 'Error interno del servidor' })
})

const PORT = process.env.PORT || 3000

try {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  console.log('MongoDB conectado')
  app.listen(PORT, () => console.log(`API lista en el puerto ${PORT}`))
} catch (error) {
  console.error('No se pudo conectar a MongoDB:', error.message)
  process.exit(1)
}
