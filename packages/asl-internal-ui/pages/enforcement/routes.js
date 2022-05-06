const list = require('./list');
const create = require('./create');
const update = require('./update');

module.exports = {
  list: {
    path: '/',
    breadcrumb: 'enforcement.list',
    router: list
  },
  create: {
    path: '/create',
    breadcrumb: 'enforcement.create',
    router: create
  },
  update: {
    path: '/:caseId',
    breadcrumb: 'enforcement.update',
    router: update
  }
};
