/* eslint-disable unicorn/prefer-module */
import {resolve} from 'node:path';
import {defineConfig} from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
    root: resolve(__dirname, 'src'),
    publicDir: resolve(__dirname, 'static'),
    build: {
        sourcemap: true,
        outDir: resolve(__dirname, 'dist'),
        rollupOptions: {
            input: {
                options: resolve(__dirname, 'src/pages/options.html'),
                background: resolve(__dirname, 'src/pages/background.html'),
            },
        },
    },
    plugins: [preact()],
});
