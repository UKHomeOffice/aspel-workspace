const ui = require('@asl/service/ui');
const { NotAuthorisedError } = require('./errors');
const { pages, content, views } = require('@asl/pages');
const {
  establishment,
  place,
  profile,
  project,
  user,
  feedback
} = pages;

const dashboard = require('../pages/dashboard');

const urls = require('./urls');

module.exports = settings => {
  const app = ui({ ...settings, views, urls });

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
    req.establishmentId = param;
    next();
  });

  app.use(urls.dashboard, dashboard(settings));

  app.use((req, res, next) => {
    req.breadcrumb('dashboard');
    next();
  });

  app.use(urls.account.menu, user());
  app.use(urls.feedback, feedback(settings));
  app.use(urls.establishment.list, establishment.list());

  app.use(urls.establishment.list, (req, res, next) => {
    req.breadcrumb('establishment.list');
    next();
  });

  app.use(urls.establishment.dashboard, (req, res, next) => {
    req.breadcrumb('establishment.dashboard');
    next();
  });

  app.use(urls.establishment.dashboard, establishment.dashboard());
  app.use(urls.establishment.read, establishment.details());
  app.use(urls.profile.list, profile());
  app.use(urls.place.list, place());
  app.use(urls.project.list, project.list());

  return app;
};
