const exporter = require('./routers/export');
const dictionary = require('./dictionary');

module.exports = {
  dictionary: {
    path: '/dictionary',
    router: dictionary,
    breadcrumb: false
  },
  export: {
    path: '/:exportId',
    router: exporter,
    breadcrumb: false
  }
};
