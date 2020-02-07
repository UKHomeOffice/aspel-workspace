const { router, mountRoutes } = require('@asl/service/ui');
const { mapValues } = require('lodash');
const { NotAuthorisedError, NotFoundError } = require('./errors');
const baseContent = require('../pages/common/content');
const { content, views } = require('@asl/pages');

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
  const app = router({ ...settings, views, urls, content: baseContent });

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

  app.param('projectId', (req, res, next, param) => {
    req.projectId = param;
    next();
  });

  app.param('versionId', (req, res, next, param) => {
    req.versionId = param;
    next();
  });

  app.param('establishmentId', (req, res, next, param) => {
    if (param === 'create') {
      return next();
    }
    req.establishmentId = parseInt(param, 10);
    if (isNaN(req.establishmentId)) {
      return next(new NotFoundError());
    }
    next();
  });

  app.use((req, res, next) => {
    res.locals.footerLinks = [
      { label: 'Privacy notice', href: '/privacy' },
      { label: 'Performance metrics', href: '/reporting' },
      { label: 'Licence fees', href: '/licence-fees' },
      { label: 'Non-technical summaries', href: '/non-technical-summaries' }
    ];
    next();
  });

  mountRoutes({ app, routes, settings });

  return app;
};
