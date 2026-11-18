const Keycloak = require('keycloak-connect');
const { Router } = require('express');
const { isEmpty } = require('lodash');
const request = require('r2');
const URLSearchParams = require('url-search-params');

const can = require('./can');
const Profile = require('./profile');

// The value Keycloak redirects back to once it has logged the session out.
// Referer/Origin reflect whatever page the browser was on when it followed
// the link to /logout, which a third-party page can set just by linking to
// this app's own /logout URL. Without this check an attacker's page would
// control where a signed-out ASPeL user lands next. Only a value that
// shares this request's own origin is trusted; anything else falls back to
// this app's own root, which is also the behaviour when neither header is
// present at all (a manual navigation to /logout, say).
const safePostLogoutRedirectUri = req => {
  const ownOrigin = `${req.protocol}://${req.get('host')}`;
  const candidate = req.headers.referer || req.headers.origin;
  if (candidate) {
    try {
      if (new URL(candidate).origin === new URL(ownOrigin).origin) {
        return candidate;
      }
    } catch {
      // Not a parseable absolute URL. Fall through to the safe default.
    }
  }
  return ownOrigin;
};

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
    if (req.path !== '/logout' && !req.session && !settings.bearerOnly) {
      return next(new Error('No session'));
    }
    next();
  });

  keycloak.accessDenied = (req, res, next) => {
    if (!isEmpty(req.query)) {
      return res.redirect(req.path);
    }
    const e = new Error('Access Denied');
    e.status = 403;
    next(e);
  };

  router.use('/logout', (req, res) => {
    // ASPeL URL
    const postLogoutRedirectUri = safePostLogoutRedirectUri(req);
    const idTokenHint = req.kauth?.grant?.id_token?.token; // Extract ID token if available

    const logoutUrl = new URL(`${settings.url}/realms/${settings.realm}/protocol/openid-connect/logout`);
    logoutUrl.searchParams.append('post_logout_redirect_uri', postLogoutRedirectUri);

    if (idTokenHint) {
      logoutUrl.searchParams.append('id_token_hint', idTokenHint);
    }

    res.redirect(logoutUrl.toString());
  });

  router.use(keycloak.middleware({ logout: '/keycloak/logout' }));
  router.use(keycloak.protect());

  router.use((req, res, next) => {
    Promise.resolve()
      .then(() => {
        const remaining = req.kauth.grant.access_token.content.exp * 1000 - Date.now();
        const user = {
          id: req.kauth.grant.access_token.content.sub,
          access_token: req.kauth.grant.access_token.token,
          keycloakRoles: req.kauth.grant.access_token.content?.realm_access?.roles ?? []
        };
        // if token is less than 30s away from expiring then refresh it
        if (remaining < 30 * 1000 && req.kauth.grant.refresh_token) {
          const body = new URLSearchParams();
          body.set('grant_type', 'refresh_token');
          body.set('client_id', settings.client);
          body.set('client_secret', settings.secret);
          body.set('refresh_token', req.kauth.grant.refresh_token.token);

          const opts = { method: 'POST', body };

          return Promise.resolve()
            .then(() => {
              return request(`${settings.url}/realms/${settings.realm}/protocol/openid-connect/token`, opts).response;
            })
            .then(response => response.json())
            .then(grant => keycloak.grantManager.createGrant(grant))
            .then(grant => {
              if (grant.access_token) {
                keycloak.storeGrant(grant, req, res);
                return {
                  ...user,
                  access_token: grant.access_token.token,
                  keycloakRoles: grant.access_token.content?.realm_access?.roles ?? []
                };
              }
              return user;
            })
            .catch(() => {
              return user;
            });
        }
        return user;
      })
      .then(user => {
        req.user = user;
        return getProfile(req.user, req.session);
      })
      .then(profile => {
        Object.assign(req.user, {
          profile,

          can: (task, params) => {
            return permissions(req.user.access_token, task, params).then(() => true).catch(() => false);
          },

          allowedActions: () => {
            return permissions(req.user.access_token).then(response => response.json);
          },

          refreshProfile: () => {
            req.session.profile.expiresAt = Date.now();
            return getProfile(req.user, req.session)
              .then(profile => {
                req.user.profile = profile;
              });
          },

          verifyPassword: (username, password) => {
            return Promise.resolve()
              .then(() => {
                const body = new URLSearchParams();
                body.set('grant_type', 'password');
                body.set('username', username);
                body.set('password', password);
                body.set('client_id', settings.client);
                body.set('client_secret', settings.secret);

                const opts = { method: 'POST', body };

                return request(`${settings.url}/realms/${settings.realm}/protocol/openid-connect/token`, opts).response;
              })
              .then(response => response.status === 200); // successful response means we got an access token
          }
        });

        Object.defineProperty(req.user, '_auth', {
          value: req.kauth.grant.access_token.content
        });
      })
      .then(() => next())
      .catch(next);
  });

  return {
    middleware: () => router,
    protect: rules => keycloak.protect(rules)
  };
};

module.exports.safePostLogoutRedirectUri = safePostLogoutRedirectUri;
