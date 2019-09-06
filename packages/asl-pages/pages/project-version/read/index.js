const { get } = require('lodash');
const { page } = require('@asl/service/ui');
const { canComment, getAllChanges, getProjectEstablishment } = require('../middleware');

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
    const task = get(req.project, 'openTasks[0]');
    const showComments = req.version.status !== 'granted' && !!task;

    res.locals.static.taskId = task ? task.id : null;
    res.locals.static.basename = req.buildRoute('project.version.read');
    res.locals.static.establishment = req.project.establishment;
    res.locals.static.isActionable = req.user.profile.asruUser && get(task, 'data.data.version') === req.versionId;
    res.locals.static.user = req.user.profile;
    res.locals.static.showComments = showComments;
    res.locals.static.commentable = showComments && req.user.profile.asruUser && res.locals.static.isCommentable;

    res.locals.static.showConditions = req.user.profile.asruUser
      ? req.version.status !== 'draft'
      : req.version.status === 'granted';

    res.locals.static.editConditions = req.user.profile.asruUser &&
      task && task.withASRU &&
      req.version.status === 'submitted' &&
      req.project.versions[0].id === req.version.id;

    res.locals.model = req.version;
    res.locals.static.project = req.project;
    res.locals.static.version = req.version.id;
    // granted legacy PPLs are displayed in "read-only" mode
    // there is no "granted view" of legacy licences
    res.locals.static.isGranted = req.project.status === 'active' &&
      req.project.granted.id === req.version.id &&
      req.project.schemaVersion > 0;
    next();
  });

  return app;
};
