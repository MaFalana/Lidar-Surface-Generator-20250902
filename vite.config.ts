import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: 'VITE_',
  base: '/',
  build: {
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
  },
})
