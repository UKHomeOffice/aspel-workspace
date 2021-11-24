const { set, get } = require('lodash');
const { page } = require('@asl/service/ui');
const datatable = require('@asl/pages/pages/common/routers/datatable');
const schema = require('./schema');

module.exports = settings => {
  const app = page({
    root: __dirname,
    ...settings
  });

  app.use((req, res, next) => {
    res.locals.pageTitle = 'Staff workload and performance';
    next();
  });

  app.use(datatable({
    configure: (req, res, next) => {
      if (!get(req.query, 'filters.withAsru')) {
        set(req.query, 'filters.withAsru', ['yes']);
      }
      next();
    },
    getApiPath: (req, res, next) => {
      const query = {
        progress: req.query.progress || 'open'
      };
      req.datatable.apiPath = ['/asru/workload', { query }];
      next();
    },
    locals: (req, res, next) => {
      console.log(req.query);
      set(res.locals, 'static.progress', req.query.progress || 'open');
      next();
    }
  })({ schema, defaultRowCount: 100 }));

  return app;
};
