const { merge } = require('lodash');
const baseContent = require('../../common/content');

module.exports = merge({}, baseContent, {
  page: {
    title: 'Staff directory',
    subtitle: 'Animals in Science Regulation Unit'
  },
  search: 'Search by name or email',
  filters: {
    admin: 'Admin',
    support: 'Business Support',
    licensing: 'Licensing Officer',
    inspector: 'Inspector'
  },
  fields: {
    name: {
      label: 'Name'
    },
    email: {
      label: 'Email'
    },
    telephone: {
      label: 'Phone'
    },
    assignedRoles: {
      label: 'Assigned roles'
    }
  }
});
