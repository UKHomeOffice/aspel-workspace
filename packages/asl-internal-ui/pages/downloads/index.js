const { page } = require('@asl/service/ui');
const dayJs = require('@ukhomeoffice/asl-components/dayjs');
const { DATE_FORMAT } = require('@ukhomeoffice/asl-constants');
const routes = require('./routes');
const schema = require('./schema/nts');
const { getNtsDateRangeModel, normaliseDate, validateNtsDateRangeQuery } = require('./lib/nts-date-validation');

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
          // Built from unpadded parts (e.g. 2025-5-1), which the error formatter can't parse strictly.
          const startDate = normaliseDate(dateRange['date-from']);
          res.locals.static.ntsDateRangeValidation = {
            model: { dateRange, ra },
            errors: validation.errors,
            startDate
          };
          res.locals.static.errors = validation.errors;
          res.locals.static.schema = {
            dateRange: schema.dates.dateRange,
            'date-from': { inputType: 'inputDate', dateLabel: "The 'From' date" },
            'date-to': {
              inputType: 'inputDate',
              dateLabel: "The 'To' date",
              validate: [{ dateIsAfter: startDate }]
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
          const end = dayJs(report.meta.end);
          return { id: report.id, year: end.format(DATE_FORMAT.year), month: end.format(DATE_FORMAT.month) };
        });
        next();
      })
      .catch(next);
  });

  app.get('/', (req, res) => res.sendResponse());

  return app;
};

module.exports.routes = routes;
