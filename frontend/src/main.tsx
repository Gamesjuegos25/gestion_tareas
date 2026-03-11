import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// 1. Importamos el nuevo componente Tablero
import { Tablero } from './component/Tablero'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 2. Renderizamos el Tablero para ver su diseño */}
    <Tablero />
  </StrictMode>,
)