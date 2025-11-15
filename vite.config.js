import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'Frontend',
  plugins: [react()],

  build: {
    outDir: 'dist',
  }
})