const { merge } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const common = require('./webpack.config.common');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
    library: {
      name: 'Entry',
      type: 'umd',
      umdNamedDefine: true,
    },
    globalObject: 'this',
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(false),
    }),
  ],
});