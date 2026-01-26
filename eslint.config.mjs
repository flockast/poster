import globals from 'globals'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

export default tseslint.config({
  files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
  ignores: ['eslint.config.mjs'],
  extends: [
    tseslint.configs.recommended
  ],
  plugins: {
    '@stylistic': stylistic
  },
  languageOptions: {
    globals: globals.node,
    parserOptions: {
      project: true,
      sourceType: 'module'
    }
  },
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports' }
    ],
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/require-await': 'off',

    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': ['error', 'always'],
    '@stylistic/quote-props': ['error', 'as-needed'],
    '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/comma-dangle': ['error', 'never'],
    '@stylistic/comma-spacing': 'error',
    '@stylistic/no-multiple-empty-lines': ['error', { max: 2 }],
    '@stylistic/eol-last': 'error',
    '@stylistic/arrow-spacing': 'error'
  }
})
