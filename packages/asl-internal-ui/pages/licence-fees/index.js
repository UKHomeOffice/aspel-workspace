const { Router } = require('express');
const routes = require('./routes');

module.exports = () => {
  const app = Router();

  app.use('/', (req, res, next) => {
    const query = {
      startDate: req.financialYear.startDate,
      endDate: req.financialYear.endDate
    };
    Promise.all([
      req.api('/billing/establishments/count', { query }),
      req.api('/billing/pils/count', { query }),
      req.api('/billing/pils/count', { query: { ...query, onlyBillable: true } })
    ])
      .then(([establishments, pils, billablePils]) => {
        req.numEstablishments = establishments.json.data;
        req.numPils = pils.json.data;
        req.numBillable = billablePils.json.data;
      })
      .then(() => next())
      .catch(next);
  });

  app.use((req, res, next) => {
    const prices = req.financialYear.prices;
    const numEstablishments = req.numEstablishments;
    const establishment = numEstablishments * prices.establishment;

    const numBillable = req.numBillable;
    const personal = numBillable * prices.personal;
    res.locals.static.fees = {
      year: req.year,
      startDate: req.financialYear.startDate,
      endDate: req.financialYear.endDate,
      establishmentFee: prices.establishment,
      personalFee: prices.personal,
      numEstablishments,
      numPersonal: req.numPils,
      numBillable: numBillable,
      establishment,
      personal,
      total: personal + establishment
    };
    next();
  });

  return app;
};

module.exports.routes = routes;
