const jwt = require('jsonwebtoken');
const { router, mountRoutes } = require('@asl/service/ui');
const { pages, views, content } = require('@asl/pages');
const { get, mapValues } = require('lodash');
const dashboard = require('../pages/dashboard');

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

  app.use(cachebuster());

  mountRoutes({ app, routes, settings })

  // app.use('/', dashboard());
  //
  // // add "home" breadcrmb to every subsequent page

  // app.use(urls.invitation, invitation());
  // app.use(urls.feedback, feedback());
  // app.use(urls.account.menu, user());
  // app.use(urls.task.base, task());
  //
  // // add "establishment" breacrumb to all pages scoped under an establishment
  // app.use(urls.establishment.dashboard, (req, res, next) => {
  //   req.breadcrumb('establishment.dashboard');
  //   next();
  // });
  //
  // app.use(urls.establishment.dashboard, establishment(settings));
  //
  // app.use(urls.profile.list, profile());
  // app.use(urls.place.list, place());
  // app.use(urls.project.list, project());
  // app.use(urls.project.version.update, updateVersion());
  // app.use(urls.project.version.read, projectVersion(settings));
  // app.use(urls.pil, pil(settings));

  // Object.keys(routes).forEach(key => {
  //   const route = routes[key];
  //   app.use(route.path, route.router({ ...settings, name: key }))
  // });

  return app;
};
