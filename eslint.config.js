//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config';

export default [
  ...tanstackConfig,
  {
    // files: ['*.ts', '*.tsx', '*.mts'],
    rules: {
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      'import/consistent-type-specifier-style': 'off',
      'sort-imports': 'off',
    },
  },
];
