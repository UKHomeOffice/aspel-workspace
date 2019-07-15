const { page } = require('@asl/service/ui');
const bodyParser = require('body-parser');
const { get } = require('lodash');
const { canComment, getAllChanges, getProjectEstablishment } = require('@asl/pages/pages/project-version/middleware');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use(
    canComment(),
    getAllChanges(),
    getProjectEstablishment()
  );

  app.use((req, res, next) => {
    if (req.project.status === 'active') {
      req.breadcrumb('project.amend');
    } else {
      req.breadcrumb('project.update');
    }
    const openTask = get(req.project, 'openTasks[0]');
    const showComments = req.version.status !== 'granted' && !!openTask;

    res.locals.static.basename = req.buildRoute('project.version.update');
    res.locals.static.establishment = req.project.establishment;
    res.locals.static.user = req.user.profile;
    res.locals.static.showComments = showComments;
    res.locals.static.commentable = showComments && res.locals.static.isCommentable;
    res.locals.static.newApplication = req.project.versions[req.project.versions.length - 1].id === req.version.id;
    res.locals.model = req.version;
    res.locals.static.project = req.project;
    res.locals.static.version = req.version.id;
    next();
  });

  app.put('/', bodyParser.json({ limit: '5mb' }));

  app.put('/', (req, res, next) => {
    const opts = {
      method: 'PUT',
      json: {
        data: {
          patch: req.body
        }
      }
    };
    req.api(`/establishments/${req.establishmentId}/projects/${req.projectId}/project-versions/${req.version.id}/patch`, opts)
      .then(() => res.json({}))
      .catch(next);
  });

  app.use((req, res, next) => res.sendResponse());

  return app;
};
