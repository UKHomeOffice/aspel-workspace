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
  projects: {
    title: 'Active Projects',
    projectTitles: 'Project titles',
    licenceNumber: 'Licence number: {{licenceNumber}}',
    expiryDate: 'Expiry date: {{expiryDate}}',
    noProjects: 'You don\'t have any active projects'
  },
  responsibilities: {
    title: 'Roles',
    noRoles: 'You don\'t have any named roles'
  },
  contactDetails: {
    title: 'Contact Details',
    professionalAddress: 'Professional Address',
    telephone: 'Telephone',
    email: 'Email Address'
  },
  pil: {
    title: 'Personal Licence',
    noPil: 'You don\'t have a personal licence (PIL)'
  },
  buttons: {
    pplApply: 'Apply for project licence',
    pilApply: 'Apply for personal licence',
    roleApply: 'Apply for named role'
  }
});
