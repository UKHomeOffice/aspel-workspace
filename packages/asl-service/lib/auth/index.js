const Keycloak = require('keycloak-connect');
const {Router} = require('express');

const can = require('./can');
const Profile = require('./profile');

module.exports = settings => {

  const router = Router();
  const getProfile = Profile(settings.profile);

  const config = {
    realm: settings.realm,
    'auth-server-url': settings.url,
    'ssl-required': 'external',
    resource: settings.client,
    credentials: {
      secret: settings.secret
    },
    bearerOnly: settings.bearerOnly
  };

  const keycloak = new Keycloak({ store: settings.store }, config);
  const permissions = can(settings.permissions);

  router.use((req, res, next) => {
    if (!req.session && !settings.bearerOnly) {
      return next(new Error('No session'));
    }
    next();
  });

  keycloak.accessDenied = (req, res, next) => {
    const e = new Error('Access Denied');
    e.status = 403;
    next(e);
  };

  router.use(keycloak.middleware());
  router.use(keycloak.protect());
  router.use((req, res, next) => {
    const user = req.kauth.grant.access_token;

    getProfile(user.token, req.session)
      .then(p => {
        req.user = {
          id: user.content.sub,
          profile: p,
          access_token: user.token,
          can: (task, params) => permissions(user.token, task, params)
        };
      })
      .then(() => next())
      .catch(next);

  });

  return {
    middleware: () => router,
    protect: rules => keycloak.protect(rules)
  };
};
