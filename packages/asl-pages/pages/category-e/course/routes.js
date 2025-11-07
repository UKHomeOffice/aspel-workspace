const add = require('./add');
const list = require('./list');
const read = require('./read');
const update = require('./update');
const remove = require('./remove');
const reschedule = require('./reschedule');
const addParticipant = require('./add-participant');

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
  },
  update: {
    path: '/:trainingCourseId/update',
    permissions: 'trainingCourse.update',
    router: update
  },
  remove: {
    path: '/:trainingCourseId/remove',
    permissions: 'trainingCourse.update',
    router: remove
  },
  reschedule: {
    path: '/:trainingCourseId/change-course-dates',
    permissions: 'trainingCourse.update',
    router: reschedule
  },
  addParticipant: {
    path: '/:trainingCourseId/add-participant',
    permissions: 'trainingCourse.update',
    router: addParticipant
  }
};
