const add = require('./add');
const list = require('./list');
const read = require('./read');

module.exports = {
  list: {
    path: '',
    permissions: 'trainingCourse.read',
    router: list
  },
  add: {
    path: '/add',
    permissions: 'trainingCourse.update',
    router: add
  },
  read: {
    path: '/:trainingCourseId',
    permissions: 'trainingCourse.read',
    router: read
  }
};
