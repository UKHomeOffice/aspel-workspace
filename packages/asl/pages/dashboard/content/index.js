const { merge } = require('lodash');
const baseContent = require('@asl/pages/pages/task/list/content');
const profileContent = require('@asl/pages/pages/profile/read/content');

module.exports = merge({}, baseContent, profileContent, {
  pageTitle: 'Home',
  tasklist: {
    title: 'Tasks',
    outstanding: {
      none: 'You have no outstanding tasks',
      some: 'You have {{count}} outstanding tasks'
    }
  },
  establishment: {
    description: 'View establishment details including people, projects and areas.',
    link: 'Go to {{name}}',
    blocked: `
      Your access to this establishment has been blocked.

      Email [aspelqueries@homeoffice.gov.uk](mailto:aspelqueries@homeoffice.gov.uk) for more information.
    `
  },
  warnings: {
    pilReviewRequired: '**Your personal licence is {{#overdue}}overdue{{/overdue}}{{^overdue}}due{{/overdue}} a 5 year review.** You need to [confirm your personal licence is still in use]({{pilUrl}}) or it may be revoked.'
  }
});
