import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: 'VITE_',
  // Use root path for Vercel, /breakline-gen/ for Azure
  base: process.env.VERCEL ? '/' : '/breakline-gen/',
  build: {
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
  },
})
