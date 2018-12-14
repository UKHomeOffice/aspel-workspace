const { merge } = require('lodash');
const baseContent = require('@asl/pages/pages/task/list/content');

module.exports = merge({}, baseContent, {
  tasklist: {
    title: 'Tasks',
    outstanding: {
      none: 'You have no outstanding tasks',
      some: 'You have {{count}} outstanding tasks'
    }
  },
  searchPanel: {
    title: 'Search',
    establishments: {
      label: 'Establishments',
      placeholder: 'Search by name',
      viewAll: 'View all establishments'
    },
    people: {
      label: 'People',
      placeholder: 'Search by name or licence number',
      viewAll: 'View all people'
    },
    projects: {
      label: 'Projects',
      placeholder: 'Search by name or licence number',
      viewAll: 'View all places'
    }
  }
});
