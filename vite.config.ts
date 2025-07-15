import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

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
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt'],
            manifest: {
                name: 'Recipe Hub',
                short_name: 'RecipeHub',
                description: 'Le tue ricette sempre con te.',
                theme_color: '#9340ff',
                background_color: '#ffffff',
                display: 'standalone',
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: ({ request }) => request.destination === 'document' || request.destination === 'script' || request.destination === 'style',
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'app-cache',
                        }
                    },
                    {
                        urlPattern: ({ request }) => request.destination === 'image',
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'image-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 giorni
                            }
                        }
                    }
                ]
            }
        })
    ],
})


