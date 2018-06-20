const path = require('path');
const { merge } = require('lodash');
const pages = path.dirname(require.resolve('@asl/pages/package.json'));
const defaults = require('@asl/service/ui/webpack.config');

const config = merge(
  defaults([ pages, __dirname ]),
  {
    output: {
      path: path.resolve(__dirname, './public/js')
    }
  }
);

module.exports = config;
