/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFiles: ["jest-webextension-mock"],
    moduleNameMapper: {
        "^react$": "preact/compat",
        "^react-dom/test-utils$": "preact/test-utils",
        "^react-dom$": "preact/compat",
        "^react/jsx-runtime$": "preact/jsx-runtime",
    },
};
