const list = require('./list');
const read = require('./read');

module.exports = {
  list: {
    path: '',
    breadcrumb: false,
    router: list
  },
  read: {
    path: '/:taskId',
    breadcrumb: false,
    router: read
  }
};
