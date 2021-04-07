const summary = require('./summary');
const download = require('./download');

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
  }
};
