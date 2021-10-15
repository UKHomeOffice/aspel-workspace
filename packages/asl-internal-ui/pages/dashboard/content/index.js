const { merge } = require('lodash');
const baseContent = require('@asl/pages/pages/task/list/content');

module.exports = merge({}, baseContent, {
  pageTitle: 'Home',
  tasklist: {
    title: 'Tasks',
    searchTasks: 'Search all tasks',
    outstanding: {
      none: 'You have no outstanding tasks',
      some: 'You have {{count}} outstanding tasks'
    }
  }
});
