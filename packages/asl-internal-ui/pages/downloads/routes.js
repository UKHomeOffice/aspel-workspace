const taskMetrics = require('./routers/task-metrics');
const report = require('./reports');

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
  }
};
