const page = require('../../../lib/page');
const datatable = require('../../common/routers/datatable');
const schema = require('./schema');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    req.datatable = {
      sort: {
        column: 'createdAt',
        ascending: false
      }
    };
    next();
  });

  app.use(datatable({
    getApiPath: (req, res, next) => {
      req.datatable.apiPath = `/establishment/${req.establishmentId}/invitations`;
      next();
    }
  })({ schema }));

  return app;
};
