import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import Sitemap from 'vite-plugin-sitemap'

const dynamicRoutes = [
    '/new-entry',
    '/your-journal',
    '/sign-up',
    '/sign-in',
    // Add other paths here
]

export default defineConfig(async () => ({
    base: '/',
    build: {
        outDir: 'dist'
    },
    plugins: [
        react(),
        tsconfigPaths(),
        Sitemap({
            hostname: 'https://concertjournal.de',
            dynamicRoutes, // pass the function here
            exclude: ['/secret-page'] // optional exclude
        })
    ],
    server: {
        port: 3010,
        open: true
    }
}))