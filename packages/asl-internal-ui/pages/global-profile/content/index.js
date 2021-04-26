const { merge } = require('lodash');
const globalProfile = require('@asl/pages/pages/global-profile/content');

module.exports = merge({}, globalProfile, {
  asru: {
    add: 'Add user to ASRU',
    remove: 'Remove user from ASRU',
    notice: 'Adding a user to ASRU gives them full access to all information from all establishments within the system.',
    roles: {
      summary: 'Everyone in ASRU can perform common tasks such as viewing licences or requesting changes.',
      title: {
        list: 'Assigned roles',
        assign: 'Assign roles'
      },
      manage: 'Edit',
      save: 'Assign roles',
      cancel: 'Cancel',
      asruAdmin: {
        label: 'Admin',
        hint: 'Add or remove people from ASRU and assign them roles or establishments'
      },
      asruSupport: {
        label: 'Business support',
        hint: 'Download reports and access performance metrics'
      },
      asruRops: {
        label: 'Returns analyst',
        hint: 'View and download consolidated returns of procedures data for all establishments'
      }
    }
  },
  breadcrumbs: {
    globalProfile: {
      read: '{{profile.firstName}} {{profile.lastName}}',
      pils: 'Personal licences'
    }
  },
  dedupe: 'Merge profile'
});
