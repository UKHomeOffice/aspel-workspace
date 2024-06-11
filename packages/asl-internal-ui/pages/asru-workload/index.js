const { set, get, pick } = require('lodash');
const moment = require('moment');
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
      req.query.progress = req.query.progress || 'open';

      if (req.query.progress !== 'open') {
        req.query.start = req.query.start || moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
        req.query.end = req.query.end || moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
      }

      if (!get(req.query, 'filters.withAsru')) {
        set(req.query, 'filters.withAsru', ['yes']);
      }
      next();
    },
    getApiPath: (req, res, next) => {
      req.datatable.apiPath = ['/asru/workload', { query: pick(req.query, ['progress', 'start', 'end']) }];
      next();
    },
    locals: (req, res, next) => {
      set(res.locals, 'static.query', pick(req.query, ['progress', 'start', 'end']));
      next();
    }
  })({ schema, defaultRowCount: 100 }));

  return app;
};
