const { Router } = require('express');
const routes = require('./routes');

module.exports = () => {
  const app = Router();

  app.param('year', (req, res, next, year) => {
    req.year = year;
    next();
  });

  app.get('/', (req, res, next) => {
    Promise.resolve()
      .then(() => req.api(`/billing`))
      .then(response => {
        const year = response.json.meta.year;
        res.redirect(req.buildRoute('fees.overview', { year }));
      })
      .catch(next);
  });

  app.use('/:year', (req, res, next) => {
    const query = { year: req.year };
    Promise.resolve()
      .then(() => req.api('/billing', { query }))
      .then(response => {
        const startDate = response.json.meta.startDate;
        const endDate = response.json.meta.endDate;
        const numPils = response.json.data.numberOfPils;
        const fees = response.json.data.fees;
        const personal = response.json.data.pils;
        const total = response.json.data.total;

        res.locals.static.fees = {
          numPils,
          fees,
          personal,
          total,
          startDate,
          endDate
        };
      })
      .then(() => next())
      .catch(next);
  });

  return app;
};

module.exports.routes = routes;
