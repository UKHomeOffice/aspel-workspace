const baseContent = require('../../content');

module.exports = {
  ...baseContent,
  noCoursesMessage: 'There are no courses yet.',
  tableCaption: 'Higher education or training courses',
  fields: {
    courseTitle: {
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
