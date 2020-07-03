const { Router } = require('express');
const search = require('./search');

module.exports = () => {

  const app = Router();

  app.param('searchType', (req, res, next, searchType) => {
    req.searchType = searchType;
    next();
  });

  app.use((req, res, next) => {
    if (req.query.experimental) {
      req.session.experimentalSearch = req.query.experimental === 'true';
    }
    next();
  });

  app.use('/:searchType', search());
  app.use('/', search());

  return app;
};
