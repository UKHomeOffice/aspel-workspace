const { page } = require('@asl/service/ui');

module.exports = () => {
  const app = page({ root: __dirname });

  app.get('/', (req, res, next) => {
    return req.api(`/profile/${req.profileId}/pil`)
      .then(({ json: { data } }) => {
        res.locals.model.pils = data.pils;
        res.locals.model.trainingPils = data.trainingPils;
      })
      .then(() => next())
      .catch(next);
  });

  app.post('/', (req, res, next) => {
    const params = {
      method: 'PUT',
      json: {
        establishmentId: req.body.establishmentId,
        profileId: req.profileId,
        pilId: req.body.pilId
      }
    };
    return req.api(`/establishment/${req.body.establishmentId}/${req.body.action}pil`, params)
      .then(({ json: { data } }) => {
        return res.redirect(req.buildRoute('globalProfile', { profileId: req.profileId }));
      }).catch(next);
  });

  return app;
};
