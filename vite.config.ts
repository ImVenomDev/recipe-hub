import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    server: {
        host: true,
        port: 3000,
        open: true,
        strictPort: true,
        cors: true,
        hmr: {
            protocol: 'ws',
            host: 'localhost',
            port: 3000,
        },
        watch: {
            usePolling: true,
            interval: 100,
        },
        fs: {
            allow: [
                '../',
            ],
        },
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    resolve: {
        alias: {
            '@': '/src',
            '@components': '/src/components',
            '@assets': '/src/assets',
            '@utils': '/src/utils',
            '@hooks': '/src/hooks',
            '@context': '/src/context',
            '@pages': '/src/pages',
        },
    },
    plugins: [
        react(),
    ],
})
