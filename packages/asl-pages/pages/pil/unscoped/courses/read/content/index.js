const { merge } = require('lodash');
const baseContent = require('../../create/content');
const status = require('../../../../../task/content/status');

module.exports = merge({}, baseContent, {
  title: 'Manage course participants',
  warning: 'Once you have applied for licences for this course, you will no longer be able to change these details.',
  participants: {
    title: 'Course participants',
    subtitle: 'Licences will be valid for 3 months from the date of approval.'
  },
  fields: {
    profile: {
      label: 'Name'
    },
    status: {
      label: 'Status'
    },
    details: {
      label: 'Details'
    },
    actions: {
      label: 'Actions'
    }
  },
  buttons: {
    edit: 'Edit',
    delete: 'Delete',
    apply: 'Apply for a licence'
  },
  notifications: {
    deleted: 'Training course deleted successfully.'
  },
  status
});
