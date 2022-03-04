const { page } = require('@asl/service/ui');
const moment = require('moment');
const { pipeline } = require('stream');
const through = require('through2');
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
    req.metrics('/reports/tasks', { stream: true, query: pick(req.form.values, 'start', 'end') })
      .then(stream => {
        let total = 0;
        let ppls = 0;
        let iterations = 0;
        return new Promise((resolve, reject) => {
          pipeline(
            stream,
            through.obj((data, enc, callback) => {
              total++;
              if (data.model === 'project' && data.action === 'application') {
                ppls++;
                iterations += data.iterations;
              }
              callback();
            }),
            err => {
              if (err) {
                return reject(err);
              }
              resolve({ total, ppls, iterations });
            }
          );
        });
      })
      .then(stats => {
        res.locals.model.tasks = stats;
      })
      .then(() => next())
      .catch(next);
  });

  app.get('/', fetchDeadlines());

  app.get('/', (req, res, next) => {
    req.metrics('/active-licences', { stream: false })
      .then(licences => {
        res.locals.model.licences = licences;
      })
      .then(() => next())
      .catch(next);
  });

  app.get('/', (req, res, next) => {
    req.metrics('/asru-workload', { stream: false, query: { withAsru: 'yes' } })
      .then(data => {
        res.locals.model.tasksOutstanding = data.reduce((map, user) => {
          map.total += user.total;
          if (user.assignedTo.id === 'unassigned') {
            map.unassigned += user.total;
          }
          return map;
        }, { total: 0, unassigned: 0 });
      })
      .then(() => next())
      .catch(next);
  });

  return app;
};

module.exports.routes = routes;
