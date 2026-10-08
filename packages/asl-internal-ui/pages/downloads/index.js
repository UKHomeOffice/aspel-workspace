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
        const ntsDownload = req.session.ntsDownload;
        delete req.session.ntsDownload;
        if (ntsDownload) {
          const { values } = ntsDownload;
          const dateRange = getNtsDateRangeModel(values);
          const ra = values.ra === 'true' ? true : values.ra === 'false' ? false : values.ra;
          const validation = validateNtsDateRangeQuery(values);
          res.locals.static.ntsDateRangeValidation = {
            model: { dateRange, ra },
            errors: validation.errors
          };
          res.locals.static.errors = validation.errors;
          res.locals.static.schema = {
            dateRange: schema.dates.dateRange,
            'date-from': { inputType: 'inputDate', dateLabel: "The 'From' date" },
            'date-to': {
              inputType: 'inputDate',
              dateLabel: "The 'To' date",
              validate: [{ dateIsAfter: dateRange['date-from'] }]
            },
            ...schema.ra
          };
          res.locals.model = { ...dateRange, ra };
        }
        res.locals.static.ntsNoResults = !!ntsDownload?.noResults;
        if (ntsDownload?.noResults) {
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
