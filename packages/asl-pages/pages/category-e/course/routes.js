const list = require('./list');
const read = require('./read');

module.exports = {
  list: {
    path: '',
    permissions: 'trainingCourse.read',
    router: list
  },
  read: {
    path: '/:trainingCourseId',
    permissions: 'trainingCourse.read',
    router: read
  }
};
