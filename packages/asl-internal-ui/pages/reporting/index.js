const { page } = require('@asl/service/ui');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.get('/', (req, res, next) => {
    const since = req.query.since || '2019-07-31';
    req.api(`/metrics?since=${since}`)
      .then(response => {
        res.locals.static.since = since;
        res.locals.static.metrics = response.json;
        next();
      })
      .catch(next);

  });

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
