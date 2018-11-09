const page = require('@asl/pages/lib/page');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    req.api(`/establishments/${req.invitation.establishmentId}/invite-user/${req.params.token}`)
      .then(response => {
        res.locals.static.establishment = response.json.meta.establishment;
      })
      .then(() => next())
      .catch(next);
  });

  app.post('/', (req, res, next) => {
    req.api(`/establishments/${req.invitation.establishmentId}/invite-user/${req.params.token}`, { method: 'PUT' })
      .then(() => {
        res.redirect('/');
      })
      .catch(next);
  });

  return app;
};
