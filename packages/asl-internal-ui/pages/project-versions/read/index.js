const { get } = require('lodash');
const { page } = require('@asl/service/ui');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    req.api(`/establishments/${req.establishmentId}/projects/${req.projectId}/project-versions/${req.versionId}`)
      .then(({ json: { data } }) => {
        req.model = data;
      })
      .then(() => next())
      .catch(next);
  });

  app.use((req, res, next) => {
    res.locals.static.basename = req.buildRoute('project.version');
    res.locals.static.establishments = req.user.profile.establishments;
    res.locals.scripts = ['/public/js/project/bundle.js'];
    const task = get(req.project, 'openTasks[0]');
    res.locals.static.taskId = task.id;
    res.locals.static.isActionable = get(task, 'data.data.version') === req.versionId;
    res.locals.model = req.model;
    res.template = require('./views/index.jsx').default;
    next();
  });

  return app;
};
