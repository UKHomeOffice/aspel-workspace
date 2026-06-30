const { page } = require('@asl/service/ui');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const resend = require('../resend');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  const verifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20
  });

  app.use((req, res, next) => {
    res.locals.static.profile = req.user.profile;
    next();
  });

  app.use(resend());

  app.get('/', verifyLimiter, (req, res, next) => {
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
