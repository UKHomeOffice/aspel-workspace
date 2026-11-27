import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const pkg = require('./package.json');
const externalDeps = Object.keys(
    Object.assign({}, pkg.dependencies, pkg.peerDependencies)
);
const nodeDeps = ['path'];
const external = ['react'].concat(externalDeps).concat(nodeDeps);

const globals = {
    react: 'React',
    'prop-types': 'PropTypes'
};

const name = 'ho-react-components';

export default {
    input: './src/index.js',

    output: [
        {
            file: 'dist/ho-react-components.js',
            format: 'umd',
            globals,
            sourcemap: true,
            name
        },
        {
            file: 'dist/ho-react-components.module.js',
            format: 'es',
            globals,
            sourcemap: true,
            name,
        }
    ],

    plugins: [
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
            ENVIRONMENT: JSON.stringify('production'),
            preventAssignment: false,
        }),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
        }),
        terser({
            sourceMap: true
        }),
        resolve({
            extensions: ['.js', '.jsx']
        }),
        commonjs()
    ],
    external,
};
