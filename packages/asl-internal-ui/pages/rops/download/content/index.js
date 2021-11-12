const common = require('../../content');

module.exports = {
  ...common,
  notifications: {
    success: 'Download requested. Your download will be available shortly.'
  },
  dictionaryLink: {
    label: 'View data dictionary',
    hint: '(opens in a new window)'
  },
  fields: {
    updatedAt: {
      label: 'Downloaded on'
    },
    profile: {
      label: 'Downloaded by'
    },
    due: {
      label: 'Total returns'
    },
    submitted: {
      label: 'Submitted returns'
    },
    outstanding: {
      label: 'Outstanding returns'
    },
    download: {
      label: 'Download'
    }
  }
};
