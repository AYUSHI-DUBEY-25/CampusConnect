import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/auth.jsx'
import { CartProvider } from './context/cart.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const authData = localStorage.getItem("auth");
if (authData) {
  const parsed = JSON.parse(authData);
  axios.defaults.headers.common["Authorization"] = `Bearer ${parsed.token}`;
}

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AuthProvider>
      <CartProvider>
 <BrowserRouter>
      <App />
    </BrowserRouter>
    </CartProvider>
    </AuthProvider>
    // {/* </StrictMode> */}
)
