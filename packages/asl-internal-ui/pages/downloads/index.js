const { page } = require('@asl/service/ui');
const form = require('@asl/pages/pages/common/routers/form');
const { dayjs: dayJs, parseDate } = require('@ukhomeoffice/asl-components/dayjs');
const { DATE_FORMAT } = require('@ukhomeoffice/asl-constants');
const routes = require('./routes');
const schema = require('./schema/nts');
const ntsDocx = require('./routers/nts-docx');
const { FEATURE_FLAG_NTS_DOCX } = require('@asl/service/ui/feature-flag');
const { NotFoundError } = require('@asl/service/errors');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    req.model = { id: 'nts-download' };
    next();
  });

  app.use(form({
    schema,
    getValidationErrors: (req, res, next) => {
      const { validationErrors } = req.form;
      if (validationErrors.form === 'noResults') {
        delete validationErrors.form;
        validationErrors.noResults = 'noResults';
      }
      if (validationErrors.dateRange === 'customValidate') {
        validationErrors.dateRange = 'maximumDateRange';
      }
      ['date-from', 'date-to'].forEach(field => {
        if (validationErrors[field] === 'dateIsSameOrAfter') {
          validationErrors[field] = 'aspelDataStartDate';
        }
      });
      if (validationErrors.ra === 'definedValues') {
        validationErrors.ra = 'required';
      }
      if (validationErrors['date-to'] === 'customValidate') {
        validationErrors['date-to'] = 'dateIsAfter';
      }
      next();
    },
    locals: (req, res, next) => {
      const start = parseDate(req.form.values['date-from']);
      if (start.isValid()) {
        req.form.schema['date-to'].validate.push({ dateIsAfter: start.format(DATE_FORMAT.iso) });
      }
      next();
    },
    configure: (req, res, next) => {
      if (req.method === 'POST' && !req.hasFeatureFlag(FEATURE_FLAG_NTS_DOCX)) {
        return next(new NotFoundError('Unauthorised to access this feature. Please contact the ASL support if you need access to this feature.'));
      }
      next();
    },
    process: (req, res, next) => {
      ['date-from', 'date-to'].forEach(key => {
        const day = req.body[`${key}-day`] || '';
        const month = req.body[`${key}-month`] || '';
        const year = req.body[`${key}-year`] || '';
        req.form.values[key] = `${year}-${month}-${day}`;
      });
      next();
    },
    saveValues: ntsDocx(settings)
  }));

  app.get('/', (req, res, next) => {
    req.api('/reports/task-metrics')
      .then(response => {
        res.locals.static.query = req.query;
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
