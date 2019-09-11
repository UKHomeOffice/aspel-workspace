const jwt = require('jsonwebtoken');
const { router } = require('@asl/service/ui');
const { pages, views, content } = require('@asl/pages');
const { get } = require('lodash');

const {
  establishment,
  place,
  profile,
  project,
  pil,
  task,
  user,
  feedback,
  projectVersion
} = pages;

const urls = require('./urls');
const dashboard = require('../pages/dashboard');
const invitation = require('../pages/invitation');

const updateVersion = require('../pages/project-versions');

module.exports = settings => {
  const app = router({ ...settings, views, urls });

  app.use((req, res, next) => {
    if (settings.internalUrl && get(req, 'user.profile.asruUser')) {
      req.session.destroy();
      return res.redirect(settings.internalUrl);
    }
    next();
  });

  app.use(content);

  app.param('profileId', (req, res, next, param) => {
    req.profileId = param;
    next();
  });

  app.param('versionId', (req, res, next, param) => {
    req.versionId = param;
    next();
  });

  app.param('establishmentId', (req, res, next, param) => {
    if (req.user.profile) {
      const establishments = req.user.profile.establishments || [];
      const establishment = establishments.find(e => e.id.toString() === param);
      if (establishment) {
        req.establishmentId = establishment.id;
        return next();
      }
    }
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  });

  app.param('token', (req, res, next, param) => {
    // eslint-disable-next-line handle-callback-err
    jwt.verify(param, settings.jwt, (err, token) => {
      req.invitation = token;
      next();
    });
  });

  app.use((req, res, next) => {
    if (req.get('pragma') === 'no-cache') {
      return req.user.refreshProfile()
        .then(() => next())
        .catch(next);
    }
    next();
  });

  app.use(urls.dashboard, dashboard());

  // add "home" breadcrmb to every subsequent page
  app.use((req, res, next) => {
    req.breadcrumb('dashboard');
    next();
  });

  app.use(urls.invitation, invitation());
  app.use(urls.feedback, feedback());
  app.use(urls.account.menu, user());
  app.use(urls.task.base, task());

  // add "establishment" breacrumb to all pages scoped under an establishment
  app.use(urls.establishment.dashboard, (req, res, next) => {
    req.breadcrumb('establishment.dashboard');
    next();
  });

  app.use(urls.establishment.dashboard, establishment());

  app.use(urls.profile.list, profile());
  app.use(urls.place.list, place());
  app.use(urls.project.list, project());
  app.use(urls.project.version.update, updateVersion());
  app.use(urls.project.version.read, projectVersion(settings));
  app.use(urls.pil.base, pil());

  return app;
};
