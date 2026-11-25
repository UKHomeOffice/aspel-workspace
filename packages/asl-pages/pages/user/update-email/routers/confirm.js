const { Router } = require('express');
const bodyParser = require('body-parser');
const { pick, get, set } = require('lodash');
const { generateSecret, checkSecret } = require('../../../../lib/middleware/csrf');

module.exports = () => {
  const app = Router();

  app.use((req, res, next) => {
    if (!get(req.session, `form[${req.model.id}].values`)) {
      return res.redirect(req.buildRoute('account.updateEmail'));
    }

    if (req.query.edit) {
      delete req.session.form[req.model.id].emailProof;
      return res.redirect(req.buildRoute('account.updateEmail'));
    }

    if (req.query.cancel) {
      delete req.session.form[req.model.id];
      return res.redirect(req.buildRoute('account'));
    }
    if (!req.session.form[req.model.id].emailProof) {
      return res.redirect(req.buildRoute('account.updateEmail'));
    }
    next();
  });

  app.use((req, res, next) => {
    delete req.session.form[req.model.id].values.password;
    res.locals.static.values = pick(req.session.form[req.model.id].values, 'email');
    next();
  });

  app.get('/', generateSecret, (req, res, next) => {
    res.locals.static.csrfToken = req.csrfToken;
    next();
  });

  app.post('/', bodyParser.urlencoded({ extended: false }), checkSecret, (req, res, next) => {
    const opts = {
      method: 'PUT',
      json: {
        emailProof: req.session.form[req.model.id].emailProof,
        data: {
          ...pick(req.session.form[req.model.id].values, 'email')
        }
      }
    };

    req.api('/me/email', opts)
      .then(response => {
        delete req.session.form[req.model.id];
        req.notification({ key: 'success' });
        return res.redirect(req.buildRoute('account.menu'));
      })
      .catch(err => {
        if (err.status === 403) {
          delete req.session.form[req.model.id].emailProof;
          set(req.session.form[req.model.id], 'validationErrors.password', 'expired');
          return res.redirect(req.buildRoute('account.updateEmail'));
        }
        if (err.message && err.message.endsWith('Email address is already in use')) {
          delete req.session.form[req.model.id].emailProof;
          set(req.session.form[req.model.id], 'validationErrors.email', 'inUse');
          return res.redirect(req.buildRoute('account.updateEmail'));
        }
        next(err);
      });
  });

  app.use((err, req, res, next) => {
    if (err.validation && err.validation.form === 'csrf') {
      return res.status(403).send('Invalid form submission');
    }
    next(err);
  });

  return app;
};
