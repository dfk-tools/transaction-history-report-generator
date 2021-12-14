module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    settings: {
        browser: true,
        jest: true
    },
    extends: [
        'plugin:@typescript-eslint/recommended'
    ],
    rules: {
        '@typescript-eslint/no-non-null-assertion': 'off'
    }
}
