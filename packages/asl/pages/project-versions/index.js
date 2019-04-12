const { Router } = require('express');
const update = require('./update');
const submit = require('./submit');
const success = require('./success');

module.exports = () => {
  const app = Router();

  app.use('/submit', submit());
  app.use('/success', success());
  app.use('/*', update());

  app.use((req, res) => res.sendResponse());

  return app;
};
