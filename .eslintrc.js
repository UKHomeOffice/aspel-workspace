
module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:security/recommended',
    'plugin:import/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  plugins: ['security', 'import'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/no-duplicates': 'error',
  },
  overrides: [
    {
      files: ['packages/*/test/**/*.js', 'packages/*/tests/**/*.js'],
      env: {
        mocha: true,
        jest: true,
      },
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
