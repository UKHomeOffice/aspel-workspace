const taskMetrics = require('./routers/task-metrics');
const report = require('./reports');
const ntsDocx = require('./routers/nts-docx');

module.exports = {
  report: {
    path: '/:report',
    router: report,
    breadcrumb: false
  },
  taskMetrics: {
    path: '/task-metrics/:exportId',
    router: taskMetrics,
    breadcrumb: false
  },
  nts: {
    path: '/nts/docx',
    router: ntsDocx,
    breadcrumb: false
  }
};
