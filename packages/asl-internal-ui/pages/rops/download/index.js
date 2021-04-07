const { page } = require('@asl/service/ui');
const routes = require('./routes');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.get('/', (req, res, next) => {
    req.api(`/rops/${req.year}/export`)
      .then(response => {
        res.locals.model = response.json.data;
        next();
      })
      .catch(next);
  });

  app.post('/', (req, res, next) => {
    req.api(`/rops/${req.year}/export`, { method: 'post' })
      .then(() => {
        req.notification({ key: 'success' });
        res.redirect(req.buildRoute('ropsReporting.download', { year: req.year }));
      })
      .catch(next);
  });

  return app;
};

module.exports.routes = routes;
