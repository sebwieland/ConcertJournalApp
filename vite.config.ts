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

export default defineConfig({
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
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/**',
                'dist/**',
                'build/**',
                '**/node_modules/**',
                '**/*.test.tsx',
                '**/*.test.ts',
                'src/tests/**',
                'src/tests/utils/**',
                'src/reportWebVitals.ts',
                'src/setupTests.ts',
                'src/utils/reportWebVitals.ts',
                'src/utils/setupTests.ts',
                'src/index.tsx',
                'src/react-app-env.d.ts'
            ],
            all: true,
            include: ['src/**/*.{js,jsx,ts,tsx}'],
            thresholds: {
                statements: 25,
                branches: 65,
                functions: 65,
                lines: 25
            },
            reportOnFailure: false
        },
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    },
})