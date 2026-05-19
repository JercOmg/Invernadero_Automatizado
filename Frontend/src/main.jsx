/**
 * Proyecto: Sistema Invernadero Automatizado
 * Modulo: main
 * Autor: Invernadero Team
 * Fecha: 2026-05-19
 * Descripcion: Componente/Servicio main
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
