const { merge } = require('lodash');
const baseContent = require('@asl/pages/pages/task/list/content');
const profileContent = require('@asl/pages/pages/profile/read/content');

module.exports = merge({}, baseContent, profileContent, {
  tasklist: {
    title: 'Tasks',
    outstanding: {
      none: 'You have no outstanding tasks',
      some: 'You have {{count}} outstanding tasks'
    }
  },
  establishment: {
    description: 'View the details of this establishment, as well as lists of approved areas, people and active projects.',
    link: 'View establishment information'
  }
});
