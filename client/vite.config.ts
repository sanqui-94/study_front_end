import {defineConfig, loadEnv} from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from 'vite-plugin-pwa';
import path from "path";


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        plugins: [
            react(), 
            tailwindcss(),
            VitePWA({
                registerType: 'autoUpdate',
                devOptions: {
                    enabled: true
                },
                workbox: {
                    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
                    navigateFallbackDenylist: [/^\/api/, /firestore\.googleapis\.com/],
                    runtimeCaching: [
                        {
                            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
                            handler: 'NetworkOnly'
                        },
                        {
                            urlPattern: /^https:\/\/identitytoolkit\.googleapis\.com\/.*/i,
                            handler: 'NetworkOnly'
                        },
                        {
                            urlPattern: /^https:\/\/securetoken\.googleapis\.com\/.*/i,
                            handler: 'NetworkOnly'
                        },
                        {
                            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                            handler: 'CacheFirst',
                            options: {
                                cacheName: 'google-fonts-cache',
                                expiration: {
                                    maxEntries: 10,
                                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                                }
                            }  
                        },
                        {
                            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                            handler: 'CacheFirst',
                            options: {
                                cacheName: 'gstatic-fonts-cache',
                                expiration: {
                                    maxEntries: 10,
                                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                                }
                            }
                        }
                    ]
                },
                manifest: {
                    name: 'Oblique Strategies',
                    short_name: 'Oblique',
                    description: 'Creative problem-solving strategies by Brian Eno and Peter Schmidt',
                    theme_color: '#8b5a3c',
                    background_color: '#faf8f5',
                    display: 'standalone',
                    orientation: 'portrait-primary',
                    scope: '/',
                    start_url: '/',
                    categories: ['creativity', 'productivity', 'education'],
                    icons: [
                        {
                            src: 'icon.svg',
                            sizes: '192x192 512x512',
                            type: 'image/svg+xml',
                            purpose: 'any'
                        }
                    ]
                }
            })
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "../shared"),
            },
        },
        server: {
            proxy: {
                "/api": {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                },
            },
        },
    };
});
