const { page } = require('@asl/service/ui');
const moment = require('moment');
const routes = require('./routes');
const { getNtsDateRangeModel, validateNtsDateRangeQuery } = require('./lib/nts-date-validation');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.get('/', (req, res, next) => {
    req.api('/reports/task-metrics')
      .then(response => {
        res.locals.static.query = req.query;
        if (req.query.validateNtsDates === 'true') {
          res.locals.static.ntsDateRangeValidation = {
            model: {
              dateRange: getNtsDateRangeModel(req.query),
              ra: req.query.ra
            },
            errors: validateNtsDateRangeQuery(req.query).errors
          };
        }
        res.locals.static.reports = response.json.data.map(report => {
          const end = moment(report.meta.end);
          return { id: report.id, year: end.format('YYYY'), month: end.format('MMMM') };
        });
        next();
      })
      .catch(next);
  });

  app.get('/', (req, res) => res.sendResponse());

  return app;
};

module.exports.routes = routes;
