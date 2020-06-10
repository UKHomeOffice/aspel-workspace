const report = require('./reports');
const experiments = require('./reports-experimental');

module.exports = {
  experiments: {
    path: '/experimental/:report',
    router: experiments,
    breadcrumb: false
  },
  report: {
    path: '/:report',
    router: report,
    breadcrumb: false
  }
};
