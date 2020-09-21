const bodyParser = require('body-parser');
const { pick, set } = require('lodash');
const { page } = require('@asl/service/ui');
const metrics = require('../../../../lib/middleware/metrics');
const schema = require('./schema');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use(metrics(settings));
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/', (req, res, next) => {
    req.datatable = req.datatable || {};
    req.datatable.schema = schema;

    const limit = 1000;
    const page = 0;

    req.datatable.pagination = { limit, page, offset: page * limit };

    return req.metrics('/reports/ppl-sla-details', { stream: false })
      .then((response) => {
        set(req.datatable, 'data.rows', response);
        set(req.datatable, 'pagination.totalCount', response.length);
        set(req.datatable, 'pagination.count', response.length);
        Object.assign(res.locals, { datatable: pick(req.datatable, ['data', 'pagination', 'sort', 'filters', 'schema']) });
        res.locals.static.metrics = {
          passed: response.length,
          missed: response.filter(row => !row.isExempt).length,
          notMissed: response.filter(row => row.isExempt).length
        };
      })
      .then(() => next())
      .catch(next);
  });

  app.post('/', (req, res, next) => {
    const { taskId, comment, isExempt } = req.body;

    const params = {
      method: 'PUT',
      json: {
        data: {
          isExempt: isExempt === 'true',
          reason: comment
        }
      }
    };

    return req.api(`/tasks/${taskId}/exemption`, params)
      .then(() => {
        req.notification({ key: 'success' });
        return res.redirect(req.buildRoute('reporting.metrics.pplSla'));
      })
      .catch(next);
  });

  return app;
};
