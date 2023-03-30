module.exports = {
    'env': {
        'node': true,
        'browser': true,
        'commonjs': true,
        'es6': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    'parserOptions': {
        'ecmaVersion': 2020,
        'sourceType': 'module'
    },
    'settings': {
        'react': {
            'version': 'detect'
        }
    },
    'rules': {
        'react/prop-types': 'off',
        'indent': [
            'error',
            4
            , { 'SwitchCase': 1 }
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'no-unused-vars': [
            'error',
            { 'argsIgnorePattern': '^_$'  }
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'object-curly-spacing': [
            'error', 'always'
        ],
        'no-trailing-spaces': [
            'error'
        ]
    },
    'overrides': [
        {
            'files': [ '**/__tests__/**' ],
            'env': {
                'jest': true
            },
            'globals': {
                'render': false,
                'shallow': false,
                'wrapper': false,
                'mount': false
            }
        },
        {
            'files': [ '**/__snapshots__/**' ],
            'excludedFiles': '*.js.snap'
        },
        {
            'files': [ 'src/**' ],
            'env': {
                'commonjs': true
            }
        }
    ]
};
