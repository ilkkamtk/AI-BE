import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {languageOptions: {globals: globals.browser}},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'comma-dangle': 0,
      'no-underscore-dangle': 0,
      'no-param-reassign': 0,
      'no-return-assign': 0,
      camelcase: 0,
      'import/extensions': 0,
      '@typescript-eslint/no-redeclare': 0,
      'prettier/prettier': 'error',
    },
  },
];
