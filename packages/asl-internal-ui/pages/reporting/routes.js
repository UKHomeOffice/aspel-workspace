const download = require('./download');
const details = require('./details');

module.exports = {
  download: {
    breadcrumb: false,
    path: '/download',
    router: download
  },
  details: {
    breadcrumb: false,
    path: '/details',
    router: details
  }
};
