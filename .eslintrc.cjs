module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Allow unused vars starting with underscore (e.g., private methods, unused params)
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    // Suppress console logs except warn/error
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // Prefer const over let when variable is never reassigned
    'prefer-const': 'warn',
    // Require === and !== over == and !=
    'eqeqeq': ['error', 'always'],
    // Disallow multiple spaces
    'no-multi-spaces': 'warn',
    // Require curly braces for all control statements
    'curly': ['warn', 'all'],
  },
};
