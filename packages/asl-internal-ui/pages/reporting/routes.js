const download = require('./download');
const details = require('./details');
const rops = require('./rops');

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
  },
  rops: {
    breadcrumb: false,
    path: '/rops',
    router: rops
  }
};
