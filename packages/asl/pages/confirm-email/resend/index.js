const { Router } = require('express');

module.exports = () => {

  const router = Router();

  router.post('/', (req, res, next) => {
    req.api('/me/resend-email', { method: 'POST' })
      .then(response => {
        req.notification({ key: 'email-sent', email: req.user.profile.email });
        res.redirect(req.buildRoute('confirmEmail'));
      })
      .catch(next);
  });

  return router;

};
