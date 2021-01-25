const jwt = require('jsonwebtoken');
const { router, mountRoutes } = require('@asl/service/ui');
const { views, content } = require('@asl/pages');
const { get, mapValues } = require('lodash');

const cachebuster = require('./middleware/profile-cachebuster');

const routes = require('./routes');

function traverseRoutes(routes) {
  return mapValues(routes, ({ path, router, routes = {} }) => {
    return {
      path,
      routes: traverseRoutes(Object.assign({}, router.routes, routes))
    };
  });
}

const urls = traverseRoutes(routes);

module.exports = settings => {
  const app = router({ ...settings, views, urls });

  app.use('/e', (req, res) => {
    res.redirect(req.originalUrl.replace('/e', '/establishments'), 301);
  });

  app.use((req, res, next) => {
    if (settings.internalUrl && get(req, 'user.profile.asruUser')) {
      req.session.destroy();
      return res.redirect(`${settings.internalUrl}${req.originalUrl}`);
    }
    next();
  });

  app.use((req, res, next) => {
    if (!get(req, 'user.profile.emailConfirmed') && !req.path.includes(req.buildRoute('confirmEmail'))) {
      return res.redirect(req.buildRoute('confirmEmail'));
    }
    next();
  });

  app.use(content);

  app.param('profileId', (req, res, next, param) => {
    req.profileId = param;
    next();
  });

  app.param('projectId', (req, res, next, param) => {
    req.projectId = param;
    next();
  });

  app.param('versionId', (req, res, next, param) => {
    req.versionId = param;
    next();
  });

  app.param('raId', (req, res, next, param) => {
    req.raId = param;
    next();
  });

  app.param('establishmentId', (req, res, next, param) => {
    req.establishmentId = parseInt(param, 10);
    next();
  });

  app.param('token', (req, res, next, param) => {
    // eslint-disable-next-line handle-callback-err
    jwt.verify(param, settings.jwt, (err, token) => {
      req.invitation = token;
      next();
    });
  });

  app.use(cachebuster());

  app.use((req, res, next) => {
    res.locals.phaseBannerSurvey = false;
    res.locals.contactUsLink = true;
    next();
  });

  mountRoutes({ app, routes, settings });

  return app;
};
