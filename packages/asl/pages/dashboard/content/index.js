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
    link: 'View establishment information',
    blocked: `
      Your access to this establishment has been blocked.

      Email [aspelqueries@homeoffice.gov.uk](mailto:aspelqueries@homeoffice.gov.uk) for more information.
    `
  },
  warnings: {
    pilReviewRequired: '**Your personal licence is {{#overdue}}overdue{{/overdue}}{{^overdue}}due{{/overdue}} a 5 year review.** You need to [confirm your personal licence is still in use]({{pilUrl}}) or it may be revoked.',
    adminPilReviewsRequired: '{{name}} has **{{overdue}} licences that are overdue** their PIL review and {{due}} licences approaching the deadline.'
  }
});
