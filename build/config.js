const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');

const extensions = [ '.ts', '.js' ];

module.exports = exports = [
    {
        input: './src/index.ts',
        output: {
            file: './dist/vue-skeleton.esm.js',
            format: 'es',
        },
        plugins: [
            commonjs(),
            babel({
                extensions,
            }),
        ],
    },
    {
        input: './src/index.ts',
        output: {
            file: './dist/vue-skeleton.cjs.js',
            format: 'cjs',
        },
        plugins: [
            commonjs(),
            babel({
                extensions,
            }),
        ],
    },
    {
        input: './src/index.ts',
        output: {
            file: './dist/vue-skeleton.js',
            name: 'VueSkeleton',
            format: 'umd',
        },
        plugins: [
            commonjs(),
            babel({
                extensions,
            }),
        ],
    },
];