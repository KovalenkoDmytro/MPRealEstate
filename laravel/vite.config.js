// vite.config.ts
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.tsx'],
            refresh: true,
        }),
        react(), // required for React + TSX
    ],
    build: {
        outDir: 'public/build',
        emptyOutDir: true,
    },
    server: {
        host: '0.0.0.0', // allows Docker or LAN access
        port: 5173,
        strictPort: true,
        cors: true, // allow cross-origin from 8000
        hmr: {
            protocol: 'ws',
            host: 'localhost', // must match browser address
            port: 5173,
        },
        watch: {
            usePolling: true,
            interval: 300, // docker-friendly
        },
    },
});
