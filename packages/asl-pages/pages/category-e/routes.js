const course = require('./course');
const licence = require('./licence');

module.exports = {
  course: {
    path: '/course',
    permissions: 'trainingCourse.read',
    breadcrumb: false,
    router: course
  },
  licence: {
    path: '/licence',
    permissions: 'trainingCourse.read',
    breadcrumb: false,
    router: licence
  }
};
