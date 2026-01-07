const { merge } = require('webpack-merge');
const common = require('./webpack.config.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    static: {
      directory: require('path').join(__dirname, '/'),
    },
    compress: true,
    port: 9000,
  },
});