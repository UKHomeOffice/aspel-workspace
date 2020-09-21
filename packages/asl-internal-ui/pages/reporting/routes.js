const download = require('./download');
const metrics = require('./metrics');

module.exports = {
  download: {
    breadcrumb: false,
    path: '/download',
    router: download
  },
  metrics: {
    breadcrumb: false,
    path: '/metrics',
    router: metrics
  }
};
