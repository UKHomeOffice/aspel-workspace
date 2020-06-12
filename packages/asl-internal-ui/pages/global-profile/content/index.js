const { merge } = require('lodash');
const globalProfile = require('@asl/pages/pages/global-profile/content');

module.exports = merge({}, globalProfile, {
  asru: {
    title: 'ASRU',
    add: 'Add user to ASRU',
    remove: 'Remove user from ASRU',
    notice: 'Adding a user to ASRU gives them full access to all information from all establishments within the system.',
    roles: {
      title: 'Permissions',
      manage: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      asruAdmin: 'User admin'
    }
  },
  dedupe: 'Merge profile'
});
