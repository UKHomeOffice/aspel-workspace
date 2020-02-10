const { Router } = require('express');
const form = require('@asl/pages/pages/common/routers/form');
const schema = require('../schema');

module.exports = () => {
  const app = Router();

  app.use(form({
    schema
  }));

  app.post('/', (req, res, next) => {
    res.redirect(req.buildRoute('revokeEstablishment', { suffix: 'confirm' }));
  });

  return app;
};
