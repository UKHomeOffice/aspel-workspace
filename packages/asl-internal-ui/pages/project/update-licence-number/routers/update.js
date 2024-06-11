const { Router } = require('express');
const form = require('@asl/pages/pages/common/routers/form');
const schema = require('../schema');

module.exports = () => {
  const app = Router();

  app.use('/', form({ schema }));

  app.post('/', (req, res, next) => {
    return res.redirect(req.buildRoute('projectAsruActions.updateLicenceNumber', { suffix: 'confirm' }));
  });

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
