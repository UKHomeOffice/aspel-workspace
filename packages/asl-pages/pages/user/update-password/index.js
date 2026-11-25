const { page } = require('@asl/service/ui');
const { set } = require('lodash');
const form = require('../../common/routers/form');
const schema = require('./schema');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname,
    paths: ['/success']
  });

  app.use((req, res, next) => {
    req.model = {
      id: `${req.user.profile.id}-password`
    };
    res.locals.static.profile = req.user.profile;
    next();
  });

  app.use('/', form({
    schema,
    sensitiveFields: ['oldPassword', 'password', 'passwordConfirm'],
    locals: (req, res, next) => {
      // clear password fields on validation fail
      res.locals.model.oldPassword = '';
      res.locals.model.password = '';
      res.locals.model.passwordConfirm = '';
      next();
    }
  }));

  app.post('/', (req, res, next) => {
    const opts = {
      method: 'PUT',
      json: {
        currentPassword: req.form.values.oldPassword,
        data: {
          password: req.form.values.password
        }
      }
    };
    return req.api('/me/password', opts)
      .then(() => {
        delete req.session.form[req.model.id];
        return res.redirect(req.buildRoute('account.updatePassword', { suffix: 'success' }));
      })
      .catch(err => {
        if (err.status === 403) {
          set(req.session.form[req.model.id], 'validationErrors.oldPassword', 'invalid');
          return res.redirect(req.buildRoute('account.updatePassword'));
        }
        next(err);
      });
  });

  app.get('/success', (req, res, next) => {
    return req.api('/me/logout', { method: 'POST' })
      .then(() => req.session.destroy())
      .then(() => res.sendResponse())
      .catch(next);
  });

  return app;
};
