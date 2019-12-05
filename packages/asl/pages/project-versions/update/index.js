const { page } = require('@asl/service/ui');
const bodyParser = require('body-parser');
const { get } = require('lodash');
const {
  canComment,
  getAllChanges,
  getProjectEstablishment,
  getPreviousProtocols
} = require('@asl/pages/pages/project-version/middleware');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use(
    canComment(),
    getAllChanges(),
    getProjectEstablishment(),
    getPreviousProtocols()
  );

  app.use((req, res, next) => {
    const isAmendment = req.project.status !== 'inactive';
    if (isAmendment) {
      req.breadcrumb('projectVersion.update');
    } else {
      req.breadcrumb('projectVersion.update-draft');
    }
    const openTask = get(req.project, 'openTasks[0]');
    const showComments = req.version.status !== 'granted' && !!openTask;
    const previousVersion = req.project.versions[1];

    res.locals.static.basename = req.buildRoute('projectVersion.update');
    res.locals.static.establishment = req.project.establishment;
    res.locals.static.user = req.user.profile;
    res.locals.static.showComments = showComments;
    res.locals.static.commentable = showComments && res.locals.static.isCommentable;

    res.locals.static.newApplication = !isAmendment && (!previousVersion || previousVersion.status === 'withdrawn');
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
      .catch(err => {
        // if trying to edit an uneditable version then redirect
        if (err.status === 400) {
          return res.redirect(req.buildRoute('projectVersion.read'));
        }
        next(err);
      });
  });

  app.use((req, res, next) => res.sendResponse());

  return app;
};
