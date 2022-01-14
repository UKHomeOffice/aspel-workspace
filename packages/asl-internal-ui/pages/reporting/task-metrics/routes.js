const exporter = require('./routers/export');

module.exports = {
  export: {
    path: '/export/:exportId',
    router: exporter,
    breadcrumb: false
  }
};
