const baseContent = require('../../content');

module.exports = {
  from: __dirname,
  ...baseContent,
  tableCaption: 'Category E PILs',
  search: {
    label: 'Search by name or email'
  },
  fields: {
    profile: {
      label: 'Name'
    },
    courseTitle: {
      label: 'Course title'
    },
    startDate: {
      label: 'Course date(s)'
    },
    licenceDetails: {
      label: 'Details'
    },
    status: {
      label: 'Status'
    },
    actions: {
      label: 'Action'
    }
  }
};
