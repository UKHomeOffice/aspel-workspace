const { defineConfig } = require('eslint/config');
const { FlatCompat } = require('@eslint/eslintrc');
const { fixupConfigRules } = require('@eslint/compat');

const compat = new FlatCompat({
  baseDirectory: __dirname
});

module.exports = defineConfig([
  {
    ignores: [
      'migrations/2018*',
      'migrations/2019*',
      'migrations/202001*',
      'migrations/202002*',
      'migrations/202003*',
      'migrations/202004*',
      'migrations/202005*',
      'migrations/202006*',
      'migrations/20200708*',
      'migrations/20200710*',
      'migrations/20200715*',
      'test/migrations/202003*',
      'test/migrations/202004*',
      'test/migrations/202005*',
      'test/migrations/202006*',
      'test/migrations/20200708*',
      'test/migrations/20200710*',
      'test/migrations/20200715*'
    ]
  },

  ...fixupConfigRules(
    compat.config({
      extends: ['@ukhomeoffice/asl'],
      rules: {
        'react/no-is-mounted': 'off',
        'standard/array-bracket-even-spacing': 'off',
        'standard/computed-property-even-spacing': 'off',
        'standard/object-curly-even-spacing': 'off',
        'filenames/match-regex': 'off',
        'no-param-reassign': 'off',
        camelcase: 'off',
        'implicit-dependencies/no-implicit': 'off'
      }
    })
  ),
  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        after: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        context: 'readonly',
        specify: 'readonly'
      }
    }
  }
]);
