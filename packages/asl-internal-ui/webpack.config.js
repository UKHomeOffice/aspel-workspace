const path = require('path');
const { merge } = require('lodash');
const pages = path.dirname(require.resolve('@asl/pages/package.json'));
const defaults = require('@asl/service/ui/webpack.config');
const babelrc = require('@asl/service/.babelrc.json');

const config = merge(
  defaults([
    {
      dir: pages,
      ignore: ['./pages/common/**', '**/pdf/**']
    },
    __dirname
  ]),
  {
    output: {
      path: path.resolve(__dirname, './public/js')
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: p => p.match(/node_modules/) && !p.match(/@joefitter\/docx/) && !p.match(/@asl/) && !p.match(/bpk-/),
          use: {
            loader: 'babel-loader',
            options: babelrc
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    }
  }
);

module.exports = config;
