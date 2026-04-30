import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { join } from 'node:path'

const __dirname = import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
      '@app': join(__dirname, 'src/app'),
      '@pages': join(__dirname, 'src/pages'),
      '@widgets': join(__dirname, 'src/widgets'),
      '@features': join(__dirname, 'src/features'),
      '@entities': join(__dirname, 'src/entities'),
      '@shared': join(__dirname, 'src/shared'),
    },
  },
})
