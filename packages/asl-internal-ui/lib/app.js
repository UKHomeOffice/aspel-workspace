const { router } = require('@asl/service/ui');
const { NotAuthorisedError, NotFoundError } = require('./errors');
const { pages, content, views } = require('@asl/pages');
const {
  establishment,
  place,
  profile,
  project,
  user,
  task,
  feedback
} = pages;

const dashboard = require('../pages/dashboard');
const search = require('../pages/search');
const globalProfile = require('../pages/profile');

const urls = require('./urls');

module.exports = settings => {
  const app = router({ ...settings, views, urls });

  app.use((req, res, next) => {
    if (!req.user || !req.user.profile || !req.user.profile.asruUser) {
      return next(new NotAuthorisedError());
    }
    next();
  });

  app.use(content);

  app.param('profileId', (req, res, next, param) => {
    req.profileId = param;
    next();
  });

  app.param('establishmentId', (req, res, next, param) => {
    req.establishmentId = parseInt(param, 10);
    if (isNaN(req.establishmentId)) {
      return next(new NotFoundError());
    }
    next();
  });

  app.use(urls.dashboard, dashboard(settings));

  app.use((req, res, next) => {
    req.breadcrumb('dashboard');
    next();
  });

  app.use(urls.task.base, task());

  app.use(urls.search, search(settings));
  app.use(urls.global.profile, globalProfile());

  app.use(urls.account.menu, user());
  app.use(urls.feedback, feedback(settings));

  app.use(urls.establishment.dashboard, (req, res, next) => {
    req.breadcrumb('establishment.dashboard');
    next();
  });

  app.use(urls.establishment.dashboard, establishment.dashboard());
  app.use(urls.establishment.read, establishment.details());
  app.use(urls.profile.list, profile());
  app.use(urls.place.list, place());
  app.use(urls.project.list, project());

  return app;
};
