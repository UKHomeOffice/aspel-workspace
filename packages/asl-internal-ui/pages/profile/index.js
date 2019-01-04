const { page } = require('@asl/service/ui');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.get('/', (req, res, next) => {
    req.breadcrumb('profile.view');
    return req.api(`/profile/${req.profileId}`)
      .then(({ json: { data, meta } }) => {
        res.locals.model = data;
      })
      .then(() => next())
      .catch(next);
  });

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
