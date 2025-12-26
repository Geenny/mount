const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '/'),
    library: {
      name: 'Engine',
      type: 'umd',
      umdNamedDefine: true,
    },
    globalObject: 'this',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'resources', to: 'resources' },
        { from: 'index.html', to: 'index.html' },
      ],
    }),
  ],
};