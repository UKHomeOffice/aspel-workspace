const { page } = require('@asl/service/ui');
const form = require('@asl/pages/pages/common/routers/form');
const moment = require('moment');

const { pipeline } = require('stream');
const through = require('through2');

const metrics = require('../../lib/middleware/metrics');

const routes = require('./routes');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use(metrics(settings));

  app.use((req, res, next) => {
    req.model = {
      id: 'metrics',
      start: moment().startOf('month').format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD')
    };
    next();
  });

  app.get('/', (req, res, next) => {
    req.api('/search/establishments', { query: { limit: 1000 } })
      .then(response => {
        res.locals.static.establishments = response.json.data.map(e => {
          return { value: e.id, label: e.name };
        });
      })
      .then(() => next())
      .catch(next);
  });

  app.use(form({
    configure: (req, res, next) => {
      req.form.schema = {
        start: {},
        end: {},
        establishment: {}
      };
      next();
    },
    getValues: (req, res, next) => {
      if (req.query.establishment === 'all') {
        req.form.values.establishment = '';
      }
      next();
    },
    process: (req, res, next) => {
      req.form.values.establishment = parseInt(req.form.values.establishment, 10);
      next();
    },
    saveValues: (req, res) => {
      res.redirect(req.baseUrl);
    }
  }));

  app.get('/', (req, res, next) => {
    const query = req.form.values;
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
            if (data.model === 'project' && data.schemaVersion === 0) {
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
            ['application', 'amendment', 'revoke', 'transfer'].forEach(action => {
              tasks[`all-project-${action}`] = 0 + tasks[`project-${action}`] + tasks[`legacyproject-${action}`];
            });
            resolve(tasks);
          }
        );
      });
    };

    const consumePPLStream = stream => {
      let total = {};
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

    const requests = [
      req.metrics('/active-licences', { stream: false, query }),
      req.metrics('/reports/ppl-sla', { stream: true, query }).then(consumePPLStream),
      req.metrics('/reports/tasks', { stream: true, query }).then(consumeTaskStream)
    ];

    return Promise.all(requests)
      .then(([ licences, deadlines, tasks ]) => {
        res.locals.static.tasks = tasks;
        res.locals.static.licences = licences;
        res.locals.static.deadlines = deadlines;
        next();
      })
      .catch(next);
  });

  app.get('/', (req, res) => res.sendResponse());

  return app;
};

module.exports.routes = routes;
