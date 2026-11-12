// Backend de Focustree: configura Express, conecta a MongoDB y enciende el servidor.
import 'dotenv/config' // carga backend/.env en process.env (debe ir primero)
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import auth from './routes/auth.js'
import categorias from './routes/categorias.js'
import clases from './routes/clases.js'
import mensajes from './routes/mensajes.js'
import ia from './routes/ia.js'

// Si falta alguna variable, avisamos cuál es y no arrancamos
const requeridas = ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_USER', 'ADMIN_PASS', 'FRONTEND_ORIGIN', 'GEMINI_API_KEY', 'GEMINI_MODEL']
const faltan = requeridas.filter((nombre) => !process.env[nombre])
if (faltan.length) {
  console.error(`Faltan variables de entorno: ${faltan.join(', ')}. Mira backend/.env.example.`)
  process.exit(1)
}

const app = express()

// CORS: el navegador solo deja que tu frontend llame a esta API si su dirección está permitida
app.use(cors({ origin: process.env.FRONTEND_ORIGIN }))
app.use(express.json({ limit: '50kb' })) // convierte el cuerpo JSON en req.body

app.use('/api/auth', auth)
app.use('/api/categorias', categorias)
app.use('/api/clases', clases)
app.use('/api/mensajes', mensajes)
app.use('/api/ia', ia)

// Manejador de errores: si una ruta falla, responde con un mensaje claro
// (Express 5 envía aquí automáticamente los errores de funciones async)
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: Object.values(err.errors)[0].message }) // reglas del modelo
  }
  if (err.code === 11000) return res.status(409).json({ error: 'Ese registro ya existe' }) // nombre repetido
  console.error(err) // el detalle real queda en la terminal, no se envía al cliente
  res.status(500).json({ error: 'Error interno del servidor' })
})

const PORT = process.env.PORT || 3000

try {
  // Si MongoDB no responde, falla a los 5 s en vez de quedarse esperando
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  console.log('MongoDB conectado')
  app.listen(PORT, () => console.log(`API lista en el puerto ${PORT}`))
} catch (error) {
  console.error('No se pudo conectar a MongoDB:', error.message)
  process.exit(1)
}
