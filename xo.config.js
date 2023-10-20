module.exports = {
    extends: "xo-react",
    space: 4,
    prettier: true,
    ignores: ["*.js"],
    rules: {
        "@typescript-eslint/no-floating-promises": "off",
        "unicorn/no-await-expression-member": "off",
        "import/extensions": "off",
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "n/file-extension-in-import": "off",
        "max-params": "off",
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "import/no-unassigned-import": "off",
        "unicorn/prefer-top-level-await": "off",
        "@typescript-eslint/member-ordering": "off"
    },
};
