const { page } = require('@asl/service/ui');

const { pipeline } = require('stream');
const through = require('through2');

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

    const consumeTaskStream = stream => {
      const tasks = {
        total: 0
      };
      return new Promise((resolve, reject) => {
        pipeline(
          stream,
          through.obj((data, enc, callback) => {
            tasks.total++;

            if (data.model === 'trainingPil') {
              data.model = 'pil'; // count training PIL tasks as PIL tasks
            }

            let type = `${data.model}-${data.action}`;
            if (data.model === 'project' && data.action !== 'grant-ra' && data.schemaVersion === 0) {
              type = `legacy-project-${data.action}`;
            }
            tasks[type] = tasks[type] + 1 || 1;
            if (data.iterations) {
              tasks[`${type}-iterations`] = tasks[`${type}-iterations`] + data.iterations || data.iterations;
            }
            callback();
          }),
          err => {
            if (err) {
              return reject(err);
            }
            // add new style and old style project counts
            ['application', 'amendment', 'revoke', 'transfer', 'change-licence-holder'].forEach(action => {
              tasks[`all-project-${action}`] = 0 + (tasks[`project-${action}`] || 0) + (tasks[`legacy-project-${action}`] || 0);
            });
            resolve(tasks);
          }
        );
      });
    };

    const consumePPLStream = stream => {
      let total = 0;
      return new Promise((resolve, reject) => {
        pipeline(
          stream,
          through.obj((data, enc, callback) => {
            total++;
            callback();
          }),
          err => {
            if (err) {
              return reject(err);
            }
            resolve(total);
          }
        );
      });
    };

    const consumePPLExpiryStream = stream => {
      const totals = { '0': 0, '1': 0 };
      return new Promise((resolve, reject) => {
        pipeline(
          stream,
          through.obj((data, enc, callback) => {
            totals[data.schema_version]++;
            callback();
          }),
          err => {
            if (err) {
              return reject(err);
            }
            resolve(totals);
          }
        );
      });
    };

    const requests = [
      req.metrics('/reports/ppl-expirations', { stream: true, query }).then(consumePPLExpiryStream),
      req.metrics('/reports/tasks', { stream: true, query }).then(consumeTaskStream)
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
