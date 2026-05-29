import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const scssAdditionalData = `
$ease: cubic-bezier(0.16, 1, 0.3, 1);

@mixin font-mono {
  font-family: 'DM Mono', monospace;
}

@mixin font-sans {
  font-family: 'DM Sans', sans-serif;
}

@mixin font-display {
  font-family: 'Syne', sans-serif;
}

@mixin container {
  max-width: 980px;
  margin: 0 auto;
  padding: 0 40px;
}

@mixin section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 48px;
}
`

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: scssAdditionalData,
      },
    },
  },
})
