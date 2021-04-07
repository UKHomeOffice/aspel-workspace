const exporter = require('./routers/export');

module.exports = {
  export: {
    path: '/:exportId',
    router: exporter,
    breadcrumb: false
  }
};
