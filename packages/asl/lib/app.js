const jwt = require('jsonwebtoken');
const { router, mountRoutes } = require('@asl/service/ui');
const { views, content } = require('@asl/pages');
const { get, mapValues } = require('lodash');

const proxy = require('@asl/service/lib/middleware/proxy');
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
  if (!settings.api) {
    throw new Error('API_URL endpoint must be defined');
  }
  if (!settings.auth.permissions) {
    throw new Error('PERMISSIONS_SERVICE endpoint must be defined');
  }

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

  app.use('/attachment', proxy(settings.attachments));

  app.use((req, res, next) => {
    if (!get(req, 'user.profile.emailConfirmed') && !req.path.includes(req.buildRoute('confirmEmail'))) {
      return res.redirect(req.buildRoute('confirmEmail'));
    }
    next();
  });

  app.use(content);

  ['profileId', 'projectId', 'versionId', 'raId', 'ropId'].forEach(param => {
    app.param(param, (req, res, next, value) => {
      req[param] = value;
      res.locals.static[param] = value;
      next();
    });
  });

  app.param('establishmentId', (req, res, next, param) => {
    req.establishmentId = parseInt(param, 10);
    res.locals.static.establishmentId = req.establishmentId;
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
    res.locals.contactUsLink = true; // enable the contact us link in the footer
    next();
  });

  // Allow authenticated access to API for use in dev
  if (settings.forwardApi) {
    app.use('/api', async (req, res) => {
      if (!req.api) {
        return res.status(500).send('API handler not configured');
      }

      try {
        const path = new URL(req.url, 'http://localhost').pathname;
        const { json, status } = await req.api(path, { query: req.query });

        return res.status(status).json(json);
      } catch (err) {
        res.status(500).json({message: err.message, ...err});
      }
    });
  }

  mountRoutes({ app, routes, settings });

  return app;
};
