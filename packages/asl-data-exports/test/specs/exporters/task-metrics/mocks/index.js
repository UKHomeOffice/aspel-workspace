const path = require('path');

const exporterModulePath = path.resolve(__dirname, '../../../../../lib/exporters/task-metrics/index.js');
const authModulePath = path.resolve(__dirname, '../../../../../lib/clients/auth.js');
const metricsModulePath = path.resolve(__dirname, '../../../../../lib/clients/metrics.js');

const mockTaskMetricsClients = ({
  onMetricsCall = () => null,
  getInternalDeadlines = () => Promise.resolve([]),
  getActionedTasksStream = () => Promise.resolve(null),
  unexpectedMessage = 'Unexpected metrics request'
} = {}) => {
  jest.resetModules();

  jest.doMock(authModulePath, () => () => () => Promise.resolve('test-token'));
  jest.doMock(metricsModulePath, () => {
    return () => (reportPath, { stream = true } = {}) => {
      onMetricsCall(reportPath, { stream });

      if (reportPath === '/reports/internal-deadlines') {
        return Promise.resolve(getInternalDeadlines());
      }

      if (reportPath === '/reports/actioned-tasks' && stream) {
        return Promise.resolve(getActionedTasksStream());
      }

      throw new Error(`${unexpectedMessage}: ${reportPath}`);
    };
  });
};

const loadTaskMetricsExporter = () => require(exporterModulePath);

const resetTaskMetricsMocks = () => {
  jest.resetModules();
  jest.unmock(authModulePath);
  jest.unmock(metricsModulePath);
};

module.exports = {
  loadTaskMetricsExporter,
  mockTaskMetricsClients,
  resetTaskMetricsMocks
};
