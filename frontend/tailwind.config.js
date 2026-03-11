/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#001d3d',   // Azul marino profundo
          light: '#bfccd9',  // Fondo celeste de tarjetas
          yellow: '#ffc300', // Amarillo vibrante
          gray: '#b4b3b3',   // Gris de apoyo
          white: '#ffffff',
        }
      },
      fontFamily: {
        // Configuramos los pesos variables directamente
        galilea: ['"Galilea Sans Variable"', 'sans-serif'],
        titan: ['"Titan One"', 'cursive'],
      },
      // Registramos tus pesos exactos del diseño
      fontWeight: {
        'tarea-bold': '700',   // Para "Tareas" y "To Do"
        'horario-reg': '400',  // Para "Horario de hoy"
        'detalle-light': '300', // Para detalles pequeños
      }
    },
  },
  plugins: [],
}