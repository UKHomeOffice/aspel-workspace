const { merge } = require('lodash');
const profileContent = require('@asl/pages/pages/profile/read/content');

module.exports = merge({}, profileContent, {
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
  notifications: {
    success: 'Changes saved!'
  },
  pil: {
    training: {
      title: 'Training',
      certificate: {
        number: 'Certificate number',
        awarded: 'Date awarded',
        body: 'Accreditation body',
        modules: 'Modules completed'
      },
      none: 'No training added'
    }
  }
});
