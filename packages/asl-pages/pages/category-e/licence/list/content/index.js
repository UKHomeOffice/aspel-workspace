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
    title: {
      label: 'Course title'
    },
    species: {
      label: 'Animals used'
    },
    startDate: {
      label: 'Course date(s)'
    },
    applications: {
      label: 'Participants added'
    },
    licences: {
      label: 'Licences granted'
    }
  }
};
