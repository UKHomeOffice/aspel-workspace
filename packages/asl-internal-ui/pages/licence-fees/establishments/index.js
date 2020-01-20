const { get } = require('lodash');
const { page } = require('@asl/service/ui');
const { datatable } = require('@asl/pages/pages/common/routers');
const schema = require('./schema');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use(datatable({
    configure: (req, res, next) => {
      req.datatable.sort = { column: 'name', ascending: true };
      next();
    },
    getApiPath: (req, res, next) => {
      const query = {
        year: req.year,
        filter: get(req.query, 'filters.*')
      };
      req.datatable.apiPath = ['/billing/establishments', { query }];
      next();
    }
  })({ schema, defaultRowCount: 30 }));

  return app;
};
