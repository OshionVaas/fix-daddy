// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' 
    ? '/fix-daddy/' // 👈 must match your GitHub repo name
    : '/',
  build: {
    outDir: 'dist',   // default, but keep explicit
    assetsDir: 'assets', // keep static assets in /assets
  },
  server: {
    port: 3000, // optional for local dev
  }
})

