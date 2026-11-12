import mongoose from 'mongoose'

const esquema = new mongoose.Schema(
  {
    // Relación: cada clase pertenece a una categoría (guarda el _id de esa categoría)
    categoriaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: [true, 'Falta la categoría'] },
    fecha: {
      type: String,
      required: [true, 'La fecha es obligatoria'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato AAAA-MM-DD']
    },
    tema: {
      type: String, required: [true, 'El tema es obligatorio'], trim: true,
      minlength: [3, 'El tema necesita al menos 3 letras'], maxlength: [80, 'El tema admite máximo 80 caracteres']
    },
    aprendi: {
      type: String, required: [true, 'Cuenta qué aprendiste'], trim: true,
      minlength: [5, 'Qué aprendí necesita al menos 5 letras'], maxlength: [2000, 'Qué aprendí admite máximo 2000 caracteres']
    },
    noEntendi: { type: String, trim: true, default: '', maxlength: [2000, 'Qué no entendí admite máximo 2000 caracteres'] },
    notas: { type: String, trim: true, default: '', maxlength: [2000, 'Las notas admiten máximo 2000 caracteres'] }
  },
  { timestamps: true }
)

export default mongoose.model('Clase', esquema)
