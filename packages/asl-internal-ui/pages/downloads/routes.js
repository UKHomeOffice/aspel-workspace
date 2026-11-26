const taskMetrics = require('./routers/task-metrics');
const report = require('./reports');
const { Router } = require('express');

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
    router: () => Router().get('/', (req, res) => res.redirect('/downloads?tab=nts')),
    breadcrumb: false
  }
};
