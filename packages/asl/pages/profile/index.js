const { page } = require('@asl/service/ui');
const { NotFoundError } = require('@asl/service/errors');
const relatedTasks = require('@asl/pages/pages/common/middleware/related-tasks');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.get('/', (req, res, next) => {
    req.breadcrumb('profile.read');

    if (req.user.profile.id !== req.profileId) {
      return next(new NotFoundError());
    }

    res.locals.static.profile = req.user.profile;
    next();
  });

  app.get('/', (req, res, next) => relatedTasks({
    model: 'profile-touched',
    modelId: req.profileId
  })(req, res, next));

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
