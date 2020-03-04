const { page } = require('@asl/service/ui');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    if (!req.project.title) {
      req.project.title = 'Untitled project';
    }
    next();
  });

  app.use((req, res, next) => {
    res.locals.model = req.project;
    res.locals.static.establishment = req.establishment;
    next();
  });

  app.use((req, res, next) => {
    const params = {
      id: req.projectId,
      licenceHolderId: req.project.licenceHolderId,
      establishment: req.establishment.id
    };
    Promise.all([
      req.user.can('project.update', params),
      req.user.can('project.revoke', params)
    ])
      .then(([canUpdate, canRevoke]) => {
        const openTask = req.project.openTasks[0];
        const editable = (!openTask || (openTask && openTask.editable));

        res.locals.static.canUpdate = canUpdate;
        res.locals.static.editable = editable;
        res.locals.static.openTask = openTask;
        res.locals.static.canRevoke = canRevoke;
        res.locals.static.asruUser = req.user.profile.asruUser;
        res.locals.static.asruLicensing = req.user.profile.asruLicensing;
      })
      .then(() => next())
      .catch(next);
  });

  app.get('/', (req, res, next) => {
    res.locals.static.confirmMessage = req.project.status === 'active'
      ? res.locals.static.content.confirm.amendment
      : res.locals.static.content.confirm.application;

    res.locals.static.confirmMessage = req.project.isLegacyStub
      ? res.locals.static.content.confirm.stub
      : res.locals.static.confirmMessage;
    next();
  });

  app.post('/', (req, res, next) => {
    req.api(`/establishment/${req.establishmentId}/project/${req.projectId}/fork`, { method: 'POST' })
      .then(({ json: { data } }) => {
        req.versionId = data.data.id;
        res.redirect(req.buildRoute('projectVersion.update'));
      })
      .catch(next);
  });

  return app;
};
