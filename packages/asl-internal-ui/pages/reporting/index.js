const { page } = require('@asl/service/ui');
const moment = require('moment');
const reducer = require('./helpers/reduce-stream');
const { pick } = require('lodash');

const routes = require('./routes');

const metrics = require('../../lib/middleware/metrics');
const metricsFilterForm = require('./metrics-filter-form');
const fetchDeadlines = require('./middleware/fetch-deadlines');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    res._promises = [];
    res.await = promise => {
      res._promises.push(promise);
    };
    res.settle = () => {
      return Promise.all(res._promises)
        .then(() => {
          res._promises = [];
        });
    };
    next();
  });

  app.use((req, res, next) => {
    req.model = {
      id: 'metrics-filter',
      start: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      end: moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
    };
    next();
  });

  app.use(metrics(settings));
  app.use(metricsFilterForm({ filterEstablishment: false }));

  app.get('/', (req, res, next) => {
    const tasks = req.metrics('/reports/tasks', { stream: true, query: pick(req.form.values, 'start', 'end') })
      .then(reducer((result, data) => {
        result.total++;
        if (data.model === 'project' && data.action === 'application') {
          result.ppls++;
          result.iterations += data.iterations;
        }
        return result;
      }, {
        total: 0,
        ppls: 0,
        iterations: 0
      }))
      .then(stats => {
        res.locals.model.tasks = stats;
      });
    res.await(tasks);
    next();
  });

  app.get('/', fetchDeadlines());

  app.get('/', (req, res, next) => {
    const licences = req.metrics('/active-licences', { stream: false })
      .then(licences => {
        res.locals.model.licences = licences;
      });
    res.await(licences);
    next();
  });

  app.get('/', (req, res, next) => {
    const workload = req.metrics('/asru-workload', { stream: false, query: { withAsru: 'yes' } })
      .then(data => {
        res.locals.model.tasksOutstanding = data.reduce((map, user) => {
          map.total += user.total;
          if (user.assignedTo.id === 'unassigned') {
            map.unassigned += user.total;
          }
          return map;
        }, { total: 0, unassigned: 0 });
      });
    res.await(workload);
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

module.exports.routes = routes;
