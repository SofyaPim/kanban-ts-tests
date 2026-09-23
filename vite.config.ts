/// <reference types="vitest/config" /> 
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Относительные пути, чтобы сборка работала и на Netlify, и на GitHub Pages
  base: '', 
  test: { 
    environment: 'happy-dom'
  },
  
  build: {
    outDir: 'dist',
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      
      // Говорим Vite включить иконки в итоговую сборку
      includeAssets: ['schedule.png', 'schedule-192.png'], 

      manifest: {
        name: 'TS Kanban Board',
        short_name: 'TS Kanban',
        description: 'Моя Канбан-доска на TypeScript',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          { 
            src: 'schedule.png', 
            sizes: '512x512', 
            type: 'image/png', 
            purpose: 'any maskable' 
          },
          { 
            src: 'schedule-192.png', 
            sizes: '192x192', 
            type: 'image/png', 
            purpose: 'any maskable' 
          }
        ]
      }
    })
  ]
});
