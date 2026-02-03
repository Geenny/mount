const { merge } = require('webpack-merge');
const webpack = require('webpack');
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
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true),
    }),
  ],
});