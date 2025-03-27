const summary = require('./summary');
const download = require('./download');
const establishments = require('./establishments');

module.exports = {
  download: {
    path: '/:year/download',
    router: download,
    breadcrumb: false
  },
  summary: {
    path: '/:year',
    router: summary,
    breadcrumb: false
  },
  establishments: {
    path: '/:year/establishments',
    router: establishments,
    breadcrumb: false
  }
};
