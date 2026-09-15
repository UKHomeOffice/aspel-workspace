const path = require('path');
const { merge } = require('lodash');
const pages = path.dirname(require.resolve('@asl/pages/package.json'));
const defaults = require('@asl/service/ui/webpack.config');
const babelrc = require('@asl/service/.babelrc.json');

const webpackBabelrc = {
  ...babelrc,
  presets: babelrc.presets.map(preset => {
    if (Array.isArray(preset) && preset[0] === '@babel/preset-env') {
      return [preset[0], { ...preset[1], modules: false }];
    }
    return preset;
  })
};

const baseConfig = defaults([
  {
    dir: pages,
    ignore: ['./pages/common/**', '**/pdf/**']
  },
  __dirname
]);

const isProduction = baseConfig.mode === 'production';

const config = merge(
  baseConfig,
  {
    output: {
      path: path.resolve(__dirname, './public/js')
    },
    devtool: isProduction ? 'hidden-source-map' : 'eval-cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: p => p.match(/node_modules/) &&
            !p.match(/@joefitter\/docx/) &&
            !p.match(/@asl/) &&
            !p.match(/bpk-/) &&
            !p.match(/@ukhomeoffice/),
          use: {
            loader: 'babel-loader',
            options: webpackBabelrc
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
