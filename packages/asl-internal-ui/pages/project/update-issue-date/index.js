const { page } = require('@asl/service/ui');
const confirm = require('./routers/confirm');
const update = require('./routers/update');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname,
    paths: ['/confirm']
  });

  app.use((req, res, next) => {
    return req.api(`/establishment/${req.establishmentId}/projects/${req.projectId}`)
      .then(({ json: { data, meta } }) => {
        req.project = data;
        req.project.openTasks = meta.openTasks;
        req.establishment = meta.establishment;
        res.locals.static.project = req.project;
        req.model = req.project;
      })
      .then(() => next())
      .catch(next);
  });

  app.use('/', update());
  app.use('/confirm', confirm());

  return app;
};
