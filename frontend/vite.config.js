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
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
      },
      manifest: false, // Gunakan manifest.json manual dari public folder
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['react-slick', 'slick-carousel', 'jquery'],
          'animation-vendor': ['gsap'],
          'date-vendor': ['date-fns'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ['jquery', 'slick-carousel'],
  },
})
