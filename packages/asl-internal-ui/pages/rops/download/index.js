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
        const data = response.json.data;
        res.locals.model = data;

        const hasPendingDownload = !!data.some(row => !row.ready);
        res.locals.static.hasPendingDownload = hasPendingDownload;

        if (req.query.requested && !hasPendingDownload) {
          const latestDownload = data[0];
          res.locals.static.downloadReady = req.buildRoute('ropsReporting.download.export', { exportId: latestDownload.id });
        }

        next();
      })
      .catch(next);
  });

  app.post('/', (req, res, next) => {
    req.api(`/rops/${req.year}/export`, { method: 'post' })
      .then(() => {
        req.notification({ key: 'success' });
        res.redirect(`${req.buildRoute('ropsReporting.download', { year: req.year })}?requested=true`);
      })
      .catch(next);
  });

  return app;
};

module.exports.routes = routes;
