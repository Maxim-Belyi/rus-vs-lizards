import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const resolvePath = (p: string) => path.resolve(__dirname, p);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': resolvePath('./src/components'),
      '@assets': resolvePath("./src/assets"),
      '@styles': resolvePath("./src/styles"),
      "@": resolvePath("./src")
    },
  },
})