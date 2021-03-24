const { Router } = require('express');
const routes = require('./routes');
const metrics = require('../../lib/middleware/metrics');
const { NotFoundError } = require('../../lib/errors');

module.exports = settings => {
  const app = Router();

  app.use(metrics(settings));

  app.get('/', (req, res, next) => {
    const year = new Date().getFullYear();
    res.redirect(req.buildRoute('ropsReporting.summary', { year }));
  });

  app.param('year', (req, res, next, year) => {
    req.year = parseInt(year, 10);
    res.locals.static.year = req.year;
    next();
  });

  app.get('/:year', (req, res, next) => {
    if (!req.user.profile.asruRops) {
      return next(new NotFoundError());
    }
    next();
  });

  app.get('/:year', (req, res, next) => {
    return req.metrics('/rops', { stream: false, query: { year: req.year } })
      .then(ropsSummary => {
        res.locals.static.ropsSummary = ropsSummary;
      })
      .then(() => next())
      .catch(next);
  });

  return app;
};

module.exports.routes = routes;
