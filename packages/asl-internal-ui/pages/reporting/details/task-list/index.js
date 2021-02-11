const { pick, set } = require('lodash');
const { page } = require('@asl/service/ui');
const { datatable } = require('@asl/pages/pages/common/routers');
const schema = require('./schema');
const reportFilters = require('./report-filters');
const metricsFilterForm = require('../../metrics-filter-form');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use(metricsFilterForm);

  app.use((req, res, next) => {
    res.locals.static.report = req.query.report;
    next();
  });

  app.get('/', datatable({
    getApiPath: (req, res, next) => {
      const query = {
        filters: {
          ...reportFilters(req),
          ...pick(req.form.values, 'start', 'end', 'establishment')
        }
      };
      req.datatable.apiPath = ['/tasks/filtered', { query }];
      next();
    },
    getValues: (req, res, next) => {
      set(res.locals.static, 'metrics.total', req.datatable.pagination.totalCount);
      next();
    }
  })({ schema, defaultRowCount: 10 }));

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
