const { merge } = require('lodash');
const profileContent = require('@asl/pages/pages/profile/read/content');

module.exports = merge({}, profileContent, {
  establishment: {
    link: 'About this establishment'
  },
  asru: {
    title: 'ASRU',
    add: 'Add to ASRU',
    remove: 'Remove from ASRU',
    roles: {
      title: 'Roles',
      manage: 'Manage roles',
      save: 'Save changes',
      cancel: 'Cancel',
      asruAdmin: 'User admin',
      asruLicensing: 'Licensing officer',
      asruInspector: 'Inspector'
    }
  },
  notifications: {
    success: 'Changes saved!'
  }
});
