/* eslint implicit-dependencies/no-implicit: [2, { dev: true }] */

const webpack = require('webpack');
const path = require('path');

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const TEMPLATE_PATH = './assets/js/pages/template.jsx';

const pages = ['places', 'roles', 'profile'];

module.exports = pages.map(page => ({
  devtool: env === 'development' && 'inline-source-map',
  mode: env,
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
