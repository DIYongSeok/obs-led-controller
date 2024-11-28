import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'], // 적용할 파일들
    languageOptions: {
      parser: '@typescript-eslint/parser', // TypeScript 파서 사용
      ecmaVersion: 'latest', // 최신 ECMAScript
      sourceType: 'module',
    },
    plugins: {
      prettier: prettierPlugin,
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      ...prettierConfig.rules, // Prettier 규칙 추가
      'prettier/prettier': 'error',
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn', // TypeScript용 린트 규칙
    },
  },
];
