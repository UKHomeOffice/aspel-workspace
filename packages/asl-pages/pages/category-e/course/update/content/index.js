const baseContent = require('../../content');

module.exports = {
  ...baseContent,
  pageTitle: 'Change course details',
  pageSubtitle: '{{trainingCourse.title}}',
  breadcrumbs: {
    categoryE: {
      course: {
        update: 'Change course details'
      }
    }
  }
};
