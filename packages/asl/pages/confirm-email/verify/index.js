const { page } = require('@asl/service/ui');
const jwt = require('jsonwebtoken');
const resend = require('../resend');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    res.locals.static.profile = req.user.profile;
    next();
  });

  app.use(resend());

  app.get('/', (req, res, next) => {
    jwt.verify(req.params.token, settings.jwt, (err, token) => {
      if (err || token.id !== req.user.profile.id || token.action !== 'confirm-email') {
        req.log('error', {
          message: err ? err.message : 'Invalid token',
          token,
          profileId: req.user.profile.id
        });
        res.locals.static.verificationError = true;
        return next();
      }
      req.api('/me/confirm-email', { method: 'POST' })
        .then(() => {
          return req.user.refreshProfile();
        })
        .then(() => next())
        .catch(next);
    });
  });

  app.get('/', (req, res) => {
    res.sendResponse();
  });

  return app;
};
