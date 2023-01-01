/* eslint-disable unicorn/prefer-module */
import {resolve} from 'node:path';
import {defineConfig} from 'vitest/config';

const resolveDir = (...paths: string[]): string => resolve(__dirname, ...paths);

export default defineConfig({
    test: {
        include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
    resolve: {
        alias: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            '@': resolveDir('src'),
        },
    },
});
