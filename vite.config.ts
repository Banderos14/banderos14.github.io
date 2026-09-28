import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// Injected into every SCSS module. Mixins only — no CSS output here,
// otherwise it would be duplicated into every module.
const scssAdditionalData = `
@mixin from($bp) {
  @if $bp == sm { @media (min-width: 480px) { @content; } }
  @else if $bp == md { @media (min-width: 768px) { @content; } }
  @else if $bp == lg { @media (min-width: 1024px) { @content; } }
  @else if $bp == xl { @media (min-width: 1280px) { @content; } }
}

@mixin shell {
  max-width: var(--page-max);
  margin-inline: auto;
  padding-inline: var(--page-gutter);
}

@mixin display {
  font-family: var(--font-display);
  font-weight: 800;
  text-transform: uppercase;
  font-kerning: normal;
}

@mixin label {
  font-family: var(--font-label);
  font-size: var(--text-xs);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: var(--tracking-label);
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
        api: 'modern-compiler',
        additionalData: scssAdditionalData,
      },
    },
  },
})
