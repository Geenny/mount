const { merge } = require('webpack-merge');
const path = require('path');
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
  }
});