const { page } = require('@asl/service/ui');

const reducer = require('../../helpers/reduce-stream');

const metricsFilterForm = require('../../metrics-filter-form');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    res.locals.static.initiatedBy = req.query.initiatedBy || 'all';
    next();
  });

  app.use(metricsFilterForm());

  app.get('/', (req, res, next) => {
    const query = { ...req.form.values, initiatedBy: req.query.initiatedBy };

    const consumeTaskStream = reducer((result, data) => {
      result.total++;
      if (data.model === 'trainingPil') {
        data.model = 'pil'; // count training PIL tasks as PIL tasks
      }

      let type = `${data.model}-${data.action}`;
      if (data.model === 'project' && data.action !== 'grant-ra' && data.schemaVersion === 0) {
        type = `legacy-project-${data.action}`;
      }
      result[type] = result[type] + 1 || 1;
      if (data.iterations) {
        result[`${type}-iterations`] = result[`${type}-iterations`] + data.iterations || data.iterations;
      }
      return result;
    }, { total: 0 });

    const consumePPLExpiryStream = reducer((result, data) => {
      result[data.schema_version]++;
      return result;
    }, { '0': 0, '1': 0 });

    const requests = [
      req.metrics('/reports/ppl-expirations', { stream: true, query })
        .then(consumePPLExpiryStream),
      req.metrics('/reports/tasks', { stream: true, query })
        .then(consumeTaskStream)
        .then(tasks => {
          ['application', 'amendment', 'revoke', 'transfer', 'change-licence-holder'].forEach(action => {
            tasks[`all-project-${action}`] = 0 + (tasks[`project-${action}`] || 0) + (tasks[`legacy-project-${action}`] || 0);
          });
          return tasks;
        })
    ];

    const result = Promise.all(requests)
      .then(([ expired, tasks ]) => {
        tasks['project-expiry'] = expired['1'];
        tasks['legacy-project-expiry'] = expired['0'];
        tasks['all-project-expiry'] = expired['0'] + expired['1'];

        res.locals.static.tasks = tasks;
      });
    res.await(result);
    next();
  });

  app.get('/', (req, res, next) => {
    res.settle()
      .then(() => next())
      .catch(next);
  });

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
