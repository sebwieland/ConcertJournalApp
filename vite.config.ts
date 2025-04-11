import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(async () => ({
    base: '/',
    build: {
        outDir: 'dist'
    },
    plugins: [
        react(),
        tsconfigPaths()
    ],
    server: {
        port: 3010,
        open: true
    }
}))