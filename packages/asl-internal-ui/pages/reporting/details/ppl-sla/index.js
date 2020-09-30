const bodyParser = require('body-parser');
const { page } = require('@asl/service/ui');
const { datatable } = require('@asl/pages/pages/common/routers');
const schema = require('./schema');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/', datatable({
    configure: (req, res, next) => {
      req.datatable.sort = { column: 'deadlineDate', ascending: true };
      next();
    },
    getApiPath: (req, res, next) => {
      req.datatable.apiPath = ['/tasks/deadline-passed'];
      next();
    },
    getValues: (req, res, next) => {
      res.locals.static.metrics = {
        passed: req.datatable.data.rows.length,
        exempt: req.datatable.data.rows.filter(row => row.isExempt).length,
        notExempt: req.datatable.data.rows.filter(row => !row.isExempt).length
      };
      next();
    }
  })({ schema, defaultRowCount: 100 }));

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
        return res.redirect(req.buildRoute('reporting.details.pplSla'));
      })
      .catch(next);
  });

  return app;
};
