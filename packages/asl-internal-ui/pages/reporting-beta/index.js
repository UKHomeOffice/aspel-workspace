const { page } = require('@asl/service/ui');
const { pipeline } = require('stream');
const through = require('through2');

const metrics = require('../../lib/middleware/metrics');

const downloads = require('./downloads');

const types = [
  'legacy-project-application',
  'legacy-project-amendment',
  'legacy-project-revoke',
  'legacy-project-transfer',
  'project-application',
  'project-amendment',
  'project-revoke',
  'project-transfer',
  'pil-application',
  'pil-amendment',
  'pil-revoke',
  'pil-transfer',
  'pil-review',
  'role-create',
  'role-delete',
  'place-update',
  'place-create',
  'place-delete',
  'profile-update'
];

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use(metrics(settings));

  app.get('/', (req, res, next) => {
    req.metrics('/active-licences', { stream: false })
      .then(json => {
        res.locals.static.licences = json;
        next();
      })
      .catch(next);
  });

  app.get('/', (req, res, next) => {
    Promise.resolve()
      .then(response => {
        res.locals.static.since = req.query.since || '2019-07-01';
        res.locals.static.types = types;
        next();
      })
      .catch(next);

  });

  app.get('/ppl-sla', (req, res, next) => {
    req.metrics('/reports/ppl-sla', { stream: false, query: req.query })
      .then(response => {
        res.json(response);
      })
      .catch(next);
  });

  app.get('/tasks', (req, res, next) => {
    req.metrics('/reports/tasks', { stream: true, query: req.query })
      .then(stream => {
        const tasks = {
          total: 0
        };
        pipeline(
          stream,
          through.obj((data, enc, callback) => {
            tasks.total++;
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
              return next(err);
            }
            res.json(tasks);
          }
        );
      })
      .catch(next);
  });

  //app.use(downloads({ types }));

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
