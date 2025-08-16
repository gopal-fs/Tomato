import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fortawesome/fontawesome-free/css/all.min.css';

import './index.css'
import App from './App.jsx'
import AuthState from './context/useContext.jsx';
import CartProvider from './context/cartContext.jsx';

createRoot(document.getElementById('root')).render(
  <AuthState>
    <CartProvider>
    <App />

    </CartProvider>
    

  </AuthState>
 
    
  
)
