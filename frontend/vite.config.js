import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' hace que las rutas de los archivos compilados sean relativas.
// Sin eso, la página publicada en GitHub Pages (que vive en /nombre-del-repo/) no encontraría sus archivos.
export default defineConfig({
  plugins: [react()],
  base: './'
})
