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
    expiryDate: 'Expiry date: {{expiryDate}}'
  },
  responsibilities: {
    title: 'Roles',
    roles: 'Roles',
    noRoles: 'This person has no named roles',
    roleApply: 'Apply for named role',
    roleRemove: 'Remove a named role'
  },
  contactDetails: {
    title: 'Contact Details',
    professionalAddress: 'Professional Address',
    telephone: 'Telephone',
    email: 'Email Address'
  }
});
