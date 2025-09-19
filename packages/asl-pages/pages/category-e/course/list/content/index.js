const baseContent = require('../../content');

module.exports = {
  ...baseContent,
  title: 'Courses and category E PILs',
  subtitle:
    'To apply for category E PILs for course participants, first add a new ' +
    'course or select an existing course.',
  tableCaption: 'Higher education or training courses',
  buttons: {
    add: 'Add course details'
  },
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
  },
  cannotUpdate: 'No training courses have been added, you’ll need to contact ' +
    'an Admin user or NTCO at your establishment if you wish to add a ' +
    'training course.'
};
