const { page } = require('@asl/service/ui');
const moment = require('moment');
const routes = require('./routes');
const schema = require('./schema/nts');
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
          const dateRange = getNtsDateRangeModel(req.query);
          const ra = req.query.ra === 'true' ? true : req.query.ra === 'false' ? false : req.query.ra;
          const validation = validateNtsDateRangeQuery(req.query);
          res.locals.static.ntsDateRangeValidation = {
            model: { dateRange, ra },
            errors: validation.errors
          };
          res.locals.static.errors = validation.errors;
          res.locals.static.schema = {
            'date-from': { inputType: 'inputDate' },
            'date-to': {
              inputType: 'inputDate',
              validate: [{ dateIsAfter: dateRange['date-from'] }]
            },
            ...schema.ra
          };
          res.locals.model = { ...dateRange, ra };
        }
        res.locals.static.ntsNoResults = req.query.noResults === 'true';
        if (req.query.noResults === 'true') {
          res.locals.static.errors = { noResults: 'noResults' };
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
