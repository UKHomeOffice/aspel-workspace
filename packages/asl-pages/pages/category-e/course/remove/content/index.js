const baseContent = require('../../content');

module.exports = {
  ...baseContent,
  pageTitle: 'Remove course',
  pageSubtitle: '{{trainingCourse.title}}',
  breadcrumbs: {
    categoryE: {
      course: {
        remove: 'Remove course'
      }
    }
  }
};
