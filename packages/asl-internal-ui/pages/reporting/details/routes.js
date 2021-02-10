const pplSla = require('./ppl-sla');
const taskList = require('./task-list');

module.exports = {
  pplSla: {
    path: '/ppl-sla',
    breadcrumb: false,
    router: pplSla
  },
  filteredTasks: {
    path: '/tasks',
    breadcrumb: false,
    router: taskList
  }
};
