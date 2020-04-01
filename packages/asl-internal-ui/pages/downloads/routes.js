const report = require('./reports');

module.exports = {
  'report': {
    path: '/:report',
    router: report,
    breadcrumb: false
  }
};
