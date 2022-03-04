const pplSla = require('./ppl-sla');
const taskList = require('./task-list');
const deadlines = require('./deadlines');
const completedTasks = require('./completed-tasks');

module.exports = {
  pplSla: {
    path: '/ppl-sla',
    breadcrumb: false,
    router: pplSla
  },
  deadlines: {
    path: '/deadlines',
    breadcrumb: false,
    router: deadlines
  },
  filteredTasks: {
    path: '/tasks',
    breadcrumb: false,
    router: taskList
  },
  completedTasks: {
    path: '/completed-tasks',
    breadcrumb: false,
    router: completedTasks
  }
};
