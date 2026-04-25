import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./resources/js/tests/setup.ts'],
        include: ['resources/js/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['node_modules', 'vendor', 'public', 'dist'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            exclude: ['node_modules', 'vendor', 'public', 'dist', 'resources/js/tests/**'],
        },
    },
});
