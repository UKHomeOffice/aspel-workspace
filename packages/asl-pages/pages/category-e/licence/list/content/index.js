const baseContent = require('../../content');

module.exports = {
  from: __dirname,
  ...baseContent,
  title: 'Courses and category E PILs',
  subtitle:
    'To apply for category E PILs for course participants, first add a new ' +
    'course or select an existing course.',
  tableCaption: 'Category E PILs',
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
    details: {
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
