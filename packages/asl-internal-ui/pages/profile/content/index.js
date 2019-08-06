const { merge } = require('lodash');
const profileContent = require('@asl/pages/pages/profile/read/content');
const pilContent = require('@asl/pages/pages/task/read/content/pil');

module.exports = merge({}, pilContent, profileContent, {
  establishment: {
    link: 'About this establishment'
  },
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
      asruAdmin: 'User admin',
      asruLicensing: 'Licensing officer',
      asruInspector: 'Inspector'
    }
  },
  dedupe: 'Merge profile',
  notifications: {
    success: 'Changes saved!'
  },
  pil: {
    training: {
      title: 'Training'
    }
  }
});
