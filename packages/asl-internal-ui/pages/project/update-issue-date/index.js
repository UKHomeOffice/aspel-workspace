const isUUID = require('uuid-validate');
const { NotFoundError } = require('@asl/service/errors');
const { page } = require('@asl/service/ui');
const confirm = require('./routers/confirm');
const update = require('./routers/update');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname,
    paths: ['/confirm']
  });

  app.param('projectId', (req, res, next, projectId) => {
    console.log(`found projectId param: ${projectId}`);

    if (!isUUID(projectId)) {
      return next(new NotFoundError());
    }
    req.projectId = projectId;

    return req.api(`/establishment/${req.establishmentId}/projects/${projectId}`)
      .then(({ json: { data, meta } }) => {
        req.project = data;
        req.project.openTasks = meta.openTasks;
        req.establishment = meta.establishment;
        res.locals.static.project = req.project;
      })
      .then(() => next())
      .catch(next);
  });

  app.use('/', update());
  app.use('/confirm', confirm());

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
