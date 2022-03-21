const { pick } = require('lodash');
const { page } = require('@asl/service/ui');

const reducer = require('../../helpers/reduce-stream');

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
    const tasks = req.metrics('/reports/actioned-tasks', { stream: true, query })
      .then(reducer((result, data) => {
        if (data.data.model !== 'project') {
          return result;
        }

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
        return result;
      }, {
        application: {
          resubmission: 0,
          first: 0
        },
        amendment: {
          resubmission: 0,
          first: 0
        }
      }))
      .then(actions => {
        res.locals.model.actions = actions;
      });

    res.await(tasks);
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
