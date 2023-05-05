import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const dev = process.env.ROLLUP_WATCH;
const serveopts = {
  contentBase: ['distjs'],
  host: '0.0.0.0',
  port: 5050,
  open: true,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

export default {
  input: 'srcjs/swiss-army-knife-card.js',
  output: {
    file: 'distjs/swiss-army-knife-card-bundle.js',
    format: 'es',
    name: 'SwissArmyKnifeCard',
    sourcemap: dev ? true : false,
  },
  watch: {
    exclude: 'node_modules/**',
  },
  plugins: [
    commonjs(),
//    json({
//      include: 'package.json',
//      preferConst: true,
//    }),
    json(),
    resolve(),
    dev && serve(serveopts),
    !dev && terser({
      mangle: {
        safari10: true,
      },
    }),
  ],
};
