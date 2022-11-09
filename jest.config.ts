/* eslint-disable @typescript-eslint/naming-convention */
import type {JestConfigWithTsJest} from 'ts-jest';

const config: JestConfigWithTsJest = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['jest-webextension-mock'],
    moduleNameMapper: {
        '^react$': 'preact/compat',
        '^react-dom/test-utils$': 'preact/test-utils',
        '^react-dom$': 'preact/compat',
        '^react/jsx-runtime$': 'preact/jsx-runtime',
    },
};

export default config;
