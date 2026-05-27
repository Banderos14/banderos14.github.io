import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // User Pages репо (banderos14.github.io) — base всегда '/'
})
