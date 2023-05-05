import serve from 'rollup-plugin-serve';

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
    sourcemap: true,
  },
  plugins: [
    serve(serveopts),
  ],
};
