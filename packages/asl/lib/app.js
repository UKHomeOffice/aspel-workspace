const express = require('express');
const morgan = require('morgan');

const session = require('@lennym/redis-session');

const assets = require('govuk-react-components').assets;
const views = require('express-react-views');

const errorHandler = require('./error-handler');

module.exports = settings => {

  settings = Object.assign({
    assets: './public'
  }, settings);

  const app = express();

  app.set('trust proxy', true);
  app.set('view engine', 'jsx');
  app.engine('jsx', views.createEngine());

  app.use(assets());
  app.use(morgan('dev'));

  app.use((req, res, next) => {
    res.locals.propositionHeader = 'Animal Science Licensing';
    next();
  });

  app.use(session(settings.session));
  app.use(require('./auth')(settings.auth));

  app.get('/', (req, res) => {
    res.render('index', { user: req.user });
  });

  app.use(errorHandler());

  return app;

};
