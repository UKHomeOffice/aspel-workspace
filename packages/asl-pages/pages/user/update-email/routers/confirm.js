const { Router } = require('express');
const { get, pick, set } = require('lodash');

module.exports = () => {
  const app = Router();

  app.use((req, res, next) => {
    if (req.query.edit) {
      return res.redirect(req.buildRoute('account.updateEmail'));
    }

    if (req.query.cancel) {
      delete req.session.form[req.model.id];
      return res.redirect(req.buildRoute('account'));
    }
    next();
  });

  app.use((req, res, next) => {
    res.locals.static.values = req.session.form[req.model.id].values;
    next();
  });

  app.post('/', (req, res, next) => {
    const opts = {
      method: 'PUT',
      json: {
        data: {
          ...pick(req.session.form[req.model.id].values, 'email')
        }
      }
    };

    req.api('/me/email', opts)
      .then(response => {
        delete req.session.form[req.model.id];
        req.session.success = {
          taskId: get(response, 'json.data.id')
        };
        return res.redirect(req.buildRoute('account.updateEmail', { suffix: 'success' }));
      })
      .catch(err => {
        if (err.message === 'Email address is already in use') {
          set(req.session.form[req.model.id], 'validationErrors.email', 'inUse');
          return res.redirect(req.buildRoute('account.updateEmail'));
        }
        next(err);
      });
  });

  return app;
};
