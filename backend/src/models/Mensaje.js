import mongoose from 'mongoose'

const esquema = new mongoose.Schema(
  {
    nombre: {
      type: String, required: [true, 'El nombre es obligatorio'], trim: true,
      minlength: [2, 'El nombre necesita al menos 2 letras'], maxlength: [80, 'El nombre admite máximo 80 caracteres']
    },
    email: {
      type: String, required: [true, 'El correo es obligatorio'], trim: true,
      match: [/^\S+@\S+\.\S+$/, 'El correo no es válido. Ejemplo: tu@email.com']
    },
    mensaje: {
      type: String, required: [true, 'El mensaje es obligatorio'], trim: true,
      minlength: [10, 'El mensaje es muy corto (mínimo 10 caracteres)'], maxlength: [1000, 'El mensaje admite máximo 1000 caracteres']
    }
  },
  { timestamps: true }
)

export default mongoose.model('Mensaje', esquema)
