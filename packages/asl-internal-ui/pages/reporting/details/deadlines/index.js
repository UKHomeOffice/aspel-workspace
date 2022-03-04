const { pipeline } = require('stream');
const through = require('through2');
const { pick } = require('lodash');
const { page } = require('@asl/service/ui');

const fetchDeadlines = require('../../middleware/fetch-deadlines');
const metricsFilterForm = require('../../metrics-filter-form');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use(metricsFilterForm());
  app.get('/', fetchDeadlines());

  app.get('/', (req, res, next) => {
    const query = pick(req.form.values, 'start', 'end');
    req.metrics('/reports/actioned-tasks', { stream: true, query })
      .then(stream => {
        const result = {
          application: {
            resubmission: 0,
            first: 0
          },
          amendment: {
            resubmission: 0,
            first: 0
          }
        };
        return new Promise((resolve, reject) => {
          pipeline(
            stream,
            through.obj((data, enc, callback) => {
              if (data.data.model !== 'project') {
                return callback();
              }
              console.log(data.id, data.metrics.resolvedAt);
              //console.log(data.id, pick(data.metrics, 'returnedCount', 'resolvedAt', 'firstReturnedAt'));
              const stats = result[data.metrics.taskType === 'pplApplication' ? 'application' : 'amendment'];
              let actions = data.metrics.returnedCount;
              if (data.metrics.resolvedAt) {
                actions += 1;
              }
              if (data.metrics.firstReturnedAt < req.form.values.start) {
                stats.resubmission += actions;
              } else if (actions > 0) {
                stats.resubmission += actions - 1;
                stats.first += 1;
              }
              callback();
            }),
            err => {
              if (err) {
                return reject(err);
              }
              resolve(result);
            }
          );
        });
      })
      .then(actions => {
        res.locals.model.actions = actions;
      })
      .then(() => next())
      .catch(next);
  });

  app.get('/', (req, res, next) => {
    next();
  });

  return app;
};
