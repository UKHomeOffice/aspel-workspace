const { merge } = require('lodash');
const profileContent = require('@asl/pages/pages/profile/read/content');
const pilContent = require('@asl/pages/pages/task/read/content/pil');
const statusContent = require('@asl/pages/pages/task/content/status');
const tasksContent = require('@asl/pages/pages/task/content/tasks');

module.exports = merge({}, pilContent, profileContent, {
  status: statusContent,
  tasks: tasksContent,
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
  },
  fields: {
    updatedAt: {
      label: 'Updated'
    },
    establishment: {
      label: 'Establishment'
    },
    licence: {
      label: 'Licence'
    },
    type: {
      label: 'Type'
    },
    status: {
      label: 'Status'
    }
  }
});
