import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const resolvePath = (p: string) => path.resolve(__dirname, p);

export default defineConfig({
  base: '/rus-vs-lizards/',
  plugins: [react()],
  resolve: {
    alias: {
      '@components': resolvePath('./src/components'),
      '@assets': resolvePath("./public/assets"),
      '@styles': resolvePath("./src/styles"),
      "@": resolvePath("./src")
    },
  },
})