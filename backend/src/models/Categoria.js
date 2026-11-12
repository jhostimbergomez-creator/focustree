import mongoose from 'mongoose'

const esquema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre de la categoría es obligatorio'],
      trim: true,
      unique: true, 
      minlength: [2, 'El nombre necesita al menos 2 letras'],
      maxlength: [30, 'El nombre admite máximo 30 caracteres']
    }
  },
  { timestamps: true } 
)

export default mongoose.model('Categoria', esquema)
