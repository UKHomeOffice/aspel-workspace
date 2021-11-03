const { merge } = require('lodash');
const baseContent = require('../../common/content');

module.exports = merge({}, baseContent, {
  page: {
    title: 'Staff directory',
    subtitle: 'Animals in Science Regulation Unit',
    description: `All registered ASRU users - including those without a role - can view information including
establishment, licence, performance and fee data and submit amendment requests for establishment or personal licences.`
  },
  search: 'Search by name or email',
  filters: {
    admin: 'Admin',
    support: 'Business Support',
    rops: 'Returns analyst',
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
