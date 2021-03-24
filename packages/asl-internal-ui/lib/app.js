const { router, mountRoutes } = require('@asl/service/ui');
const { mapValues, get } = require('lodash');
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

  ['profileId', 'projectId', 'versionId', 'raId', 'ropId', 'searchType'].forEach(param => {
    app.param(param, (req, res, next, value) => {
      req[param] = value;
      res.locals.static[param] = value;
      next();
    });
  });

  app.param('establishmentId', (req, res, next, param) => {
    if (param === 'create') {
      return next();
    }
    req.establishmentId = parseInt(param, 10);
    res.locals.static.establishmentId = req.establishmentId;
    if (isNaN(req.establishmentId)) {
      return next(new NotFoundError());
    }
    next();
  });

  app.use((req, res, next) => {
    const footerLinks = [
      {
        sectionName: 'Reporting',
        links: [
          { label: 'Licence fees', href: '/licence-fees' }
        ]
      },
      {
        sectionName: 'ASRU',
        links: [
          { label: 'Staff directory', href: '/asru/profiles' }
        ]
      }
    ];

    const allowedActions = get(req.user, 'profile.allowedActions.global', []);

    if (allowedActions.includes('asruReporting')) {
      footerLinks[0].links = [
        ...footerLinks[0].links,
        { label: 'Performance metrics', href: '/reporting' },
        { label: 'Downloads', href: '/downloads' }
      ];
    }

    if (allowedActions.includes('asruRops')) {
      footerLinks[0].links.push({ label: 'Returns of procedures', href: '/rops' });
    }

    res.locals.footerLinks = footerLinks;
    next();
  });

  mountRoutes({ app, routes, settings });

  return app;
};
