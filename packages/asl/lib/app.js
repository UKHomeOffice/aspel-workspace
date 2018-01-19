const express = require('express');
const morgan = require('morgan');

const assets = require('govuk-react-components').assets;

module.exports = settings => {

  settings = Object.assign({
    assets: './public'
  }, settings);

  const app = express();

  app.set('view engine', 'jsx');
  app.engine('jsx', require('express-react-views').createEngine());

  app.use(assets());

  app.use(morgan('dev'));

  app.use((req, res, next) => {
    res.locals.propositionHeader = 'Animal Science Licensing';
    next();
  });

  app.use(require('./auth')(settings.auth));

  app.get('/', (req, res) => {
    res.render('index', { user: req.user });
  });

  return app;

};
