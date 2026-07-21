import React from 'react'
import ReactDOM from 'react-dom/client'
import './lib/wagmi' // initialize Web3Modal
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
