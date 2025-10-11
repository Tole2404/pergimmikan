import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { HelmetProvider } from 'react-helmet-async'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/sweetalert-retro.css';
import './styles/index.css'
import './styles/responsive.css'
import { registerSW } from 'virtual:pwa-register'

// Registrasi PWA Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    // Tampilkan pemberitahuan bahwa ada update
    if (confirm('App baru tersedia. Perbarui aplikasi?')) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log('App siap digunakan offline');
  },
});

// Create a context for Helmet
const helmetContext = {};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider context={helmetContext}>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>,
)
