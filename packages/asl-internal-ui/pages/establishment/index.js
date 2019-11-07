const { Router } = require('express');
const create = require('./create');

module.exports = settings => {
  const app = Router({ mergeParams: true });

  app.use('/create', create(settings));

  return app;
};
