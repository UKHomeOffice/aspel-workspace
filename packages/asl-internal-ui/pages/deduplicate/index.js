const bodyParser = require('body-parser');
const { page } = require('@asl/service/ui');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/', (req, res, next) => {
    return req.api(`/profile/${req.profileId}`)
      .then(({ json: { data } }) => {
        res.locals.static.profile = data;
      })
      .then(() => next())
      .catch(next);
  });

  app.get('/', (req, res, next) => {
    if (req.query.search) {
      res.locals.static.search = req.query.search;
      return req.api(`/search/profiles`, { query: { search: req.query.search } })
        .then(({ json: { data } }) => {
          res.locals.static.alternates = data.filter(p => p.id !== req.profileId);
        })
        .then(() => next())
        .catch(next);
    }
    next();
  });

  app.post('/', (req, res, next) => {
    const params = {
      method: 'post',
      json: {
        data: {
          target: req.body.profile
        }
      }
    };

    return req.api(`/profile/${req.profileId}/merge`, params)
      .then(({ json: { data } }) => {
        req.notification({ key: 'success' });
        return res.redirect(req.buildRoute('globalProfile', { profileId: req.body.profile }));
      })
      .catch(next);
  });

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
