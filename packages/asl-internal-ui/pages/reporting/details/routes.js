const pplSla = require('./ppl-sla');
const taskList = require('./task-list');
const deadlines = require('./deadlines');
const completedTasks = require('./completed-tasks');

module.exports = {
  pplSla: {
    path: '/ppl-sla',
    breadcrumb: 'statutoryDeadlines',
    router: pplSla
  },
  deadlines: {
    path: '/deadlines',
    breadcrumb: 'deadlines',
    router: deadlines
  },
  filteredTasks: {
    path: '/tasks',
    breadcrumb: 'completedTasks',
    router: taskList
  },
  completedTasks: {
    path: '/completed-tasks',
    breadcrumb: 'completedTasks',
    router: completedTasks
  }
};
