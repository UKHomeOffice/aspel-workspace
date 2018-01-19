const Keycloak = require('keycloak-connect');
const {Router} = require('express');
const {MemoryStore} = require('express-session');

module.exports = settings => {

  const router = Router();
  const store = new MemoryStore();

  const config = {
    realm: settings.realm,
    'auth-server-url': settings.url,
    'ssl-required': 'external',
    resource: settings.client,
    credentials: {
      secret: settings.secret
    }
  };

  const keycloak = new Keycloak({ store }, config);

  router.use(keycloak.middleware());
  router.use(keycloak.protect());
  router.use((req, res, next) => {
    const user = req.kauth.grant.id_token.content;
    req.user = {
      id: user.sub,
      firstName: user.given_name,
      lastName: user.family_name
    };
    next();
  });

  return router;
};
