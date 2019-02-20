const { page } = require('@asl/service/ui');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    res.locals.model = req.model.project;
    next();
  });

  app.post('/', (req, res, next) => {
    req.api(`/establishments/${req.establishmentId}/projects/${req.projectId}/project-versions/${req.versionId}/submit`, { method: 'POST' })
      .then(() => req.api(`/establishments/${req.establishmentId}/projects/${req.projectId}/grant`, { method: 'POST' }))
      .then(() => res.redirect(req.buildRoute('project.success')))
      .catch(next);
  });

  return app;
};
