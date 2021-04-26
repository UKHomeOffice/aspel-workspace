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

  return app;
};
