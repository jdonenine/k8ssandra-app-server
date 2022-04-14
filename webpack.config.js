const path = require('path');
const {NODE_ENV = 'production'} = process.env;
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.ts',
  mode: NODE_ENV,
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader', 'typegraphql-description-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'k8ssandra-app-server.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
