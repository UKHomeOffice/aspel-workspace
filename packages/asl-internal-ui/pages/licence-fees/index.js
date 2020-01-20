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
        const { startDate, endDate } = response.json.meta;
        const numPils = response.json.data.numberOfPils;
        const numPels = response.json.data.numberOfPels;
        const { fees, personal, establishment, total } = response.json.data;

        res.locals.static.fees = {
          numPils,
          numPels,
          fees,
          personal,
          establishment,
          total,
          startDate,
          endDate,
          year: req.year
        };
      })
      .then(() => next())
      .catch(next);
  });

  return app;
};

module.exports.routes = routes;
