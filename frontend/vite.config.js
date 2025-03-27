// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,
    strictPort: true,
    // 👇 wichtig
    fs: {
      strict: false,
    }
  },
  build: {
    outDir: 'dist'
  }
})
