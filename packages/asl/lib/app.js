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

  app.param('establishmentId', (req, res, next, param) => {
    req.establishmentId = param;
    return next();
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

  app.use(cachebuster());

  mountRoutes({ app, routes, settings });

  return app;
};
