const typescript = require('rollup-plugin-typescript');
const vue = require('rollup-plugin-vue');
const commonjs = require('rollup-plugin-commonjs');

module.exports = exports = [
    {
        input: './src/index.ts',
        output: {
            file: './dist/vue-skeleton.esm.js',
            format: 'es',
        },
        plugins: [
            commonjs(),
            vue({
                css: './dist/vue-skeleton.css',
            }),
            typescript(),
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
            vue({
                css: './dist/vue-skeleton.css',
            }),
            typescript(),
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
            vue({
                css: './dist/vue-skeleton.css',
            }),
            typescript(),
        ],
    },
];