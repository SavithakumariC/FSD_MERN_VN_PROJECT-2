import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import GeneralContextProvider from './context/GeneralContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GeneralContextProvider>
        <App />
      </GeneralContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)