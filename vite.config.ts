/* eslint-disable unicorn/prefer-module */
import {resolve} from 'node:path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

const resolveDir = (...paths: string[]): string => resolve(__dirname, ...paths);

// https://vitejs.dev/config/
export default defineConfig({
    root: resolveDir('src'),
    publicDir: resolveDir('static'),
    build: {
        sourcemap: true,
        emptyOutDir: false,
        outDir: resolveDir('dist'),
        rollupOptions: {
            input: {
                options: resolveDir('src/pages/options.html'),
                popup: resolveDir('src/pages/popup.html'),
                background: resolveDir('src/pages/background.html'),
            },
        },
    },
    css: {
        devSourcemap: true,
    },
    plugins: [react()],
    resolve: {
        alias: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            '@': resolveDir('src'),
        },
    },
});
