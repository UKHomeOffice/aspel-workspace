const { page } = require('@asl/pages');
const workflow = require('../../lib/middleware/workflow');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use(workflow(settings));

  app.get('/', (req, res, next) => {
    req.workflow('/')
      .then(response => {
        res.locals.static.schema = {
          type: {
            show: true,
            accessor: 'data'
          },
          created_at: {
            show: true
          },
          status: {
            show: true
          },
          id: {
            show: true
          }
        };
        res.locals.datatable = {
          data: {
            rows: response.json.data
              .sort((a, b) => a.created_at < b.created_at ? 1 : -1)
          }
        };
      })
      .then(() => next())
      .catch(next);
  });

  app.get('/', (req, res, next) => {
    res.locals.static.profile = req.user.profile;
    next();
  });

  app.post('/task/:id', (req, res, next) => {
    const params = {
      method: 'PUT',
      json: { status: 'resolved' }
    };
    req.workflow(`/${req.params.id}/status`, params)
      .then(() => {
        res.redirect('/');
      })
      .catch(next);
  });

  return app;
};
