module.exports = {
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: 'eslint:recommended',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'no-var': ['error'],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', {allowTemplateLiterals: true}],
    semi: ['error', 'always']
  }
};
