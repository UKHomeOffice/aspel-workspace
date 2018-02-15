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

    const url = `${settings.api}/establishment/${establishment.toLowerCase()}${req.url}`;
    fetch(url, { headers }).response
      .then(response => {
        res.locals.api = {
          url: response.url,
          status: response.status
        };
        return response.json();
      })
      .then(json => {
        res.locals.api.data = JSON.stringify(json, null, '  ');
        if (res.locals.api.status > 399) {
          const err = new Error(json.message);
          Object.assign(err, json);
          throw err;
        }
        res.locals.establishment = json.meta.establishment;
        res.locals.data = json.data;
      })
      .then(() => next())
      .catch(e => next(e));

  });

  app.get('/roles', (req, res) => {
    res.render('roles', {
      roles: res.locals.data
    });
  });

  app.get('/profile/:id', (req, res) => {
    res.render('profile', {
      profile: res.locals.data
    });
  });

  app.get('/places', (req, res) => {
    res.render('places', {
      places: res.locals.data
    });
  });

  app.get('/', (req, res) => {
    res.render('index');
  });

  app.use(errorHandler());

  return app;

};
