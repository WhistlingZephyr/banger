/* eslint-disable unicorn/prefer-module */
import {resolve} from 'node:path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    root: resolve(__dirname, 'src/'),
    publicDir: resolve(__dirname, 'static'),
    build: {
        sourcemap: true,
        outDir: resolve(__dirname, 'dist/'),
        rollupOptions: {
            input: {
                options: resolve(__dirname, 'src/pages/options.html'),
                background: resolve(__dirname, 'src/pages/background.html'),
            },
        },
    },
    css: {
        devSourcemap: true,
    },
    plugins: [react()],
});
