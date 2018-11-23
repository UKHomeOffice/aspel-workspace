const page = require('@asl/pages/lib/page');

const ErrorPage = require('./views/error');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    if (req.invitation && req.user.profile.establishments.find(e => e.id === req.invitation.establishmentId)) {
      return res.redirect('/');
    }
    next();
  });

  app.use((req, res, next) => {
    req.api(`/invitation/${req.params.token}`)
      .then(response => {
        res.locals.static.establishment = response.json.meta.establishment;
      })
      .then(() => next())
      .catch(next);
  });

  app.post('/', (req, res, next) => {
    req.api(`/invitation/${req.params.token}`, { method: 'PUT' })
      .then(() => {
        delete req.session.profile;
        res.redirect('/');
      })
      .catch(next);
  });

  app.use((err, req, res, next) => {
    if (err.status === 404) {
      err.template = ErrorPage;
    }
    return next(err);
  });

  return app;
};
