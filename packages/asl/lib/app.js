const ui = require('@asl/service/ui');
const fetch = require('r2');
const errorHandler = require('./error-handler');

module.exports = settings => {

  const app = ui(settings);

  app.static.use((req, res, next) => {
    res.locals.propositionHeader = 'Animal Science Licensing';
    next();
  });

  app.use((req, res, next) => {
    const establishment = req.user.get('establishment');
    if (!establishment) {
      return next();
    }
    const headers = {
      Authorization: `bearer ${req.user.access_token}`
    };
    const url = `${settings.api}/establishment/${establishment.toLowerCase()}`;
    fetch(url, { headers }).response
      .then(response => {
        res.locals.url = response.url;
        res.locals.status = response.status;
        return response.json();
      })
      .then(json => {
        res.locals.data = JSON.stringify(json, null, '  ');
      })
      .then(() => next())
      .catch(e => next(e));
  });

  app.get('/', (req, res) => {
    res.render('index', {
      name: req.user.get('name'),
      establishment: req.user.get('establishment')
    });
  });

  app.use(errorHandler());

  return app;

};
