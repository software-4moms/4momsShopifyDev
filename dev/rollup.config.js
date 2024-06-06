import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default {
  input: './main.js',
  output: {
    file: `./theme.bundle.js`,
    format: 'iife',
  },
  plugins: [
    nodeResolve({
      mainFields: ['module', 'main'],
      browser: true,
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env']
    })
  ]
};