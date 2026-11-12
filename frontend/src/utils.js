// Fecha de hoy en formato AAAA-MM-DD según la hora local del usuario
export function hoy() {
  const d = new Date()
  return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}
