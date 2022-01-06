const download = require('./download');
const details = require('./details');
const taskMetrics = require('./task-metrics');

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
  taskMetrics: {
    breadcrumb: 'taskMetrics',
    path: '/task-metrics',
    router: taskMetrics
  }
};
