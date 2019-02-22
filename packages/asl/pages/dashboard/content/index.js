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
  responsibilities: {
    title: 'Roles',
    noRoles: "You don't have any named roles",
    roleApply: 'Apply for named role'
  },
  projects: {
    title: 'Active Projects',
    licenceNumber: 'Licence number: {{licenceNumber}}',
    expiryDate: 'Expiry date: {{expiryDate}}',
    noProjects: "You don't have any active projects"
  },
  contactDetails: {
    title: 'Contact Details',
    professionalAddress: 'Professional Address',
    telephone: 'Telephone',
    email: 'Email Address'
  },
  permissionLevel: {
    title: 'Permission level'
  },
  buttons: {
    continue: 'Continue',
    pplApply: 'Apply for project licence',
    pilApply: 'Apply for personal licence',
    roleApply: 'Apply for named role'
  },
  pil: {
    title: 'Personal Licence',
    noPil: "You don't have a personal licence (PIL)",
    user: {
      incomplete: 'You have an incomplete PIL application.',
      notStarted: "You don't hold a personal (PIL) licence."
    },
    other: {
      incomplete: 'Incomplete PIL application.',
      notStarted: 'No personal (PIL) licence held.'
    }
  }
});
