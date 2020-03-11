const isUUID = require('uuid-validate');
const { page } = require('@asl/service/ui');
const confirm = require('./routers/confirm');
const update = require('./routers/update');
const { NotFoundError } = require('../../../lib/errors');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname,
    paths: ['/confirm']
  });

  app.use((req, res, next) => {
    if (!isUUID(req.projectId)) {
      return next(new NotFoundError());
    }

    return req.api(`/establishment/${req.establishmentId}/projects/${req.projectId}`)
      .then(({ json: { data, meta } }) => {
        req.project = data;

        if (!req.project.isLegacyStub) {
          throw new NotFoundError();
        }

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
