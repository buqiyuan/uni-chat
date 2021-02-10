module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
    es6: true,
  },

  plugins: ['vue', 'prettier', '@typescript-eslint'],

  extends: [
    'plugin:vue/recommended',
    // '@vue/prettier',
    'prettier/vue',
    '@vue/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],

  parser: 'vue-eslint-parser',

  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
