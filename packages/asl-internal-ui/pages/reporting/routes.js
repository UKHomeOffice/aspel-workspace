const download = require('./download');

module.exports = {
  download: {
    breadcrumb: false,
    path: '/download',
    router: download
  }
};
