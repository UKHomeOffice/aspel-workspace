const fs = require('fs');
const path = require('path');

const TEMPLATE_PATH = './assets/js/pages/template.jsx';

const pages = fs.readdirSync(path.resolve(__dirname, './views/pages')).map(p => p.replace('.jsx', ''));

module.exports = pages.map(page => ({
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
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react']
        }
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
  }
}));
