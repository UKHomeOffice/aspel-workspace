const { page } = require('@asl/service/ui');
const bodyParser = require('body-parser');
const { get, pick } = require('lodash');
const { canComment } = require('@asl/pages/pages/project-version/middleware');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use(canComment());

  app.use((req, res, next) => {
    const openTask = get(req.project, 'openTasks[0]');
    const establishment = req.establishment;
    const showComments = req.version.status !== 'granted' && !!openTask;

    res.locals.static.basename = req.buildRoute('project.version.update');
    res.locals.static.establishments = req.user.profile.establishments.filter(e => e.id !== establishment.id);
    res.locals.static.establishment = establishment;
    res.locals.static.user = req.user.profile;
    res.locals.static.showComments = showComments;
    res.locals.static.commentable = showComments && res.locals.static.isCommentable;
    res.locals.model = req.version;
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
