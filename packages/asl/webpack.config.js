const path = require('path');
const { merge } = require('lodash');
const pages = path.dirname(require.resolve('@asl/pages/package.json'));
const defaults = require('@asl/service/ui/webpack.config');

const config = merge(
  {
    entry: {
      project: path.resolve(__dirname, 'assets/js/project.js')
    }
  },
  defaults([ pages, __dirname ]),
  {
    output: {
      path: path.resolve(__dirname, './public/js')
    }
  }
);

module.exports = config;
