import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Register global chart mount animation plugin
import './lib/chartMountPlugin'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
