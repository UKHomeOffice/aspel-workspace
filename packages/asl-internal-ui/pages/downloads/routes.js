const report = require('./reports');
const conditionsReport = require('./reports/conditions-report');

module.exports = {
  pplConditionsReport: {
    path: '/ppl-conditions',
    router: conditionsReport,
    breadcrumb: false
  },
  report: {
    path: '/:report',
    router: report,
    breadcrumb: false
  }
};
