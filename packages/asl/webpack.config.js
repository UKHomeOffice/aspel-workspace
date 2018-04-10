const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

const TEMPLATE_PATH = './assets/js/pages/template.jsx';

const pages = ['places'];

module.exports = pages.map(page => ({
  devtool: 'inline-source-map',
  entry: {
    [page]: path.resolve(__dirname, TEMPLATE_PATH)
  },
  output: {
    path: path.resolve(__dirname, './public/js/pages')
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: path.resolve(__dirname, TEMPLATE_PATH),
        loader: 'string-replace-loader',
        options: {
          search: '{{page}}',
          replace: page
        }
      }
    ]
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/layouts\/app/, require.resolve('./views/layouts/stub.jsx'))
  ]
}));
