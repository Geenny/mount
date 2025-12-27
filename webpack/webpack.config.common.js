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
    fallback: {
        "fs": false,
        "module": false
    },
    alias: {
        app: path.join(__dirname, "../", "src/app"),
        config: path.join(__dirname, "../", "src/config"),
        core: path.join(__dirname, "../", "src/core"),
        utils: path.join(__dirname, "../", "src/utils"),
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '/'),
    library: {
      name: 'Entry',
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