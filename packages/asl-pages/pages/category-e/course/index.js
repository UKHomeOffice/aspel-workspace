const { Router } = require('express');
const routes = require('./routes');

module.exports = _settings => {
  const app = Router({ mergeParams: true });

  app.use(
    (req, res, next) => {
      next();
    });

  return app;
};

module.exports.routes = routes;
