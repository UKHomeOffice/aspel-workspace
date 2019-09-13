const Api = require('@asl/service/api');
const Taskflow = require('@ukhomeoffice/taskflow');
const schema = require('@asl/schema');
const {
  resubmitted,
  autoResolved,
  resolved,
  returnedToApplicant,
  discardedByApplicant,
  recalledByApplicant,
  updated
} = require('./flow/status');
const tasksRouter = require('./router/tasks');
const modelTasksRouter = require('./router/model-tasks');
const metricsRouter = require('./router/metrics');

const decorators = require('./decorators');

const profile = require('./middleware/profile');
const resolveProjectVersionUpdates = require('./middleware/resolve-project-version-updates');

const hooks = {
  unique: require('./hooks/create/unique'),
  updateData: require('./hooks/update-data'),
  clearDeadline: require('./hooks/clear-deadline'),
  meta: require('./hooks/meta'),
  create: require('./hooks/create'),
  resolve: require('./hooks/resolve'),
  validateStatus: require('./hooks/validate/status'),
  validatePayload: require('./hooks/validate/payload'),
  autoForward: require('./hooks/auto-forward'),
  notify: require('./hooks/notify'),
  update: require('./hooks/update'),
  discard: require('./hooks/discard'),
  recall: require('./hooks/recall')
};

module.exports = settings => {
  const app = Api(settings);
  settings.models = schema(settings.db);

  app.use(profile(settings));

  app.use(resolveProjectVersionUpdates(settings));

  const flow = Taskflow({ db: settings.taskflowDB });

  flow.decorate(decorators.metadata(settings));
  flow.decorate(decorators.deadline(settings));
  flow.decorate(decorators.activityLog(settings), { list: false });
  flow.decorate(decorators.nextSteps(settings), { list: false });
  flow.decorate(decorators.licenceHolder(settings), { list: false });

  flow.hook('pre-create', hooks.unique(settings));

  flow.hook('create', hooks.meta(settings));
  flow.hook('create', hooks.create(settings));
  flow.hook(`status:*:${resubmitted.id}`, hooks.create(settings));

  flow.hook(`status:*:${recalledByApplicant.id}`, hooks.clearDeadline(settings));
  flow.hook(`status:*:${returnedToApplicant.id}`, hooks.clearDeadline(settings));

  flow.hook(`pre-status:*:${updated.id}`, hooks.update(settings));

  flow.hook(`pre-status:*:${recalledByApplicant.id}`, hooks.recall(settings));
  flow.hook(`pre-status:*:${returnedToApplicant.id}`, hooks.recall(settings));

  flow.hook('status:*:*', hooks.autoForward(settings));
  flow.hook('status:*:*', hooks.notify(settings));

  flow.hook('pre-status:*:*', hooks.updateData(settings));

  flow.hook('pre-status:*:*', hooks.validateStatus());
  flow.hook('pre-status:*:*', hooks.validatePayload());
  flow.hook(`pre-status:*:${resolved.id}`, hooks.resolve(settings));
  flow.hook(`status:*:${autoResolved.id}`, hooks.resolve(settings));
  flow.hook('comment', hooks.notify(settings));

  flow.hook(`status:*:${discardedByApplicant.id}`, hooks.discard(settings));

  app.use('/metrics', metricsRouter(flow));
  app.use('/model-tasks', modelTasksRouter(flow));
  app.use('/', tasksRouter(flow));
  app.use(flow);

  app.use((err, req, res, json) => {
    err.status = err.status || 500;
    req.log('error', { ...err, message: err.message, stack: err.stack });
    res.status(err.status);
    res.json({
      message: err.message,
      stack: err.stack
    });
  });

  return app;
};
