const { merge } = require('lodash');
const baseContent = require('@asl/pages/pages/task/list/content');
const searchPanel = require('../../components/search-panel/content');

module.exports = merge({}, baseContent, {
  pageTitle: 'Home',
  tasklist: {
    title: 'Tasks',
    outstanding: {
      none: 'You have no outstanding tasks',
      some: 'You have {{count}} outstanding tasks'
    }
  },
  searchPanel
});
