const ui = require('@asl/service/ui');
const pdf = require('./pdf');
const errorHandler = require('./error-handler');

module.exports = settings => {

  const app = ui(settings);

  app.static.use((req, res, next) => {
    res.locals.propositionHeader = 'Research and testing with animals';
    next();
  });

  app.use(pdf(settings));

  app.use((req, res, next) => {
    const establishment = req.user.get('establishment');
    if (!establishment) {
      return next(new Error('No associated establishment'));
    }

    const url = `/establishment/${establishment}${req.url}`;
    req.api(url)
      .then(response => {
        res.locals.api = response;
        res.locals.api.data = JSON.stringify(response.json, null, '  ');
        res.locals.establishment = response.json.meta.establishment;
        res.locals.data = response.json.data;
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

  app.get('/places', (req, res, next) => {
    res.render('places', {
      places: res.locals.data
    });
  });

  app.get('/', (req, res) => {
    res.render('index', {
      establishment: res.locals.data,
      elh: res.locals.data.roles.find(r => r.type === 'elh')
    });
  });

  app.use(errorHandler());

  return app;

};
