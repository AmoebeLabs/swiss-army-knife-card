import resolve from 'rollup-plugin-node-resolve';
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import commonjs from '@rollup/plugin-commonjs';

const dev = process.env.ROLLUP_WATCH;
const serveopts = {
  contentBase: ['./distjs'],
  host: '0.0.0.0',
  port: 5000,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

export default {
  input: 'srcjs/swiss-army-knife-card.js',
  output: {
    file: 'distjs/swiss-army-knife-card-bundle.js',
    format: 'es5',
    name: 'SwissArmyKnifeCard',
    sourcemap: dev ? true : false,
  },
  plugins: [
    commonjs(),
    json({
      include: 'package.json',
      preferConst: true,
    }),
    resolve(),
    dev && serve(serveopts),
  ],
};