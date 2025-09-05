// vite.config.ts
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [laravel({ input: ['resources/js/app.tsx'], refresh: true })],
    server: {
        host: '0.0.0.0',         // listen inside container
        port: 5173,
        strictPort: true,
        cors: true,              // allow cross-origin from 8000
        hmr: {
            protocol: 'ws',
            host: 'localhost',     // EXACT host you type in the browser (localhost)
            port: 5173,
        },
        watch: { usePolling: true, interval: 300 }, // docker-friendly
    },
});
