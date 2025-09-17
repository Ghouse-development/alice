module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['react', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  rules: {
    'react/react-in-jsx-scope': 'off', // Next.js では不要
    'react/jsx-no-comment-textnodes': 'error',
    'react/jsx-no-useless-fragment': 'warn',
    'no-unexpected-multiline': 'error',
    'no-extra-parens': [
      'error',
      'all',
      {
        ignoreJSX: 'multi-line',
        nestedBinaryExpressions: false,
        enforceForArrowConditionals: false,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    // JSX内の余計なテキストノードや括弧ズレを早期検知
    'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
    'react/jsx-closing-tag-location': 'error',
    'react/jsx-tag-spacing': [
      'error',
      {
        closingSlash: 'never',
        beforeSelfClosing: 'always',
        afterOpening: 'never',
        beforeClosing: 'never',
      },
    ],
    'react/jsx-wrap-multilines': [
      'error',
      {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'parens-new-line',
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
