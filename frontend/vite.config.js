import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: ['images/logo_gimik.png', 'images/**/*', 'offline.html', 'manifest.json'],
      injectManifest: {
        injectionPoint: undefined,
        swSrc: 'public/service-worker.js',
        swDest: 'dist/service-worker.js',
      },
      manifest: false, // Gunakan manifest.json manual dari public folder
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
      }
    })
  ]
})
