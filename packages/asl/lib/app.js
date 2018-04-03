const ui = require('@asl/service/ui');
const pdf = require('./pdf');
const errorHandler = require('./error-handler');

const api = url => {
  return (req, res, next) => {
    url = url || req.url;
    const establishment = req.user.get('establishment');
    if (!establishment) {
      return next(new Error('No associated establishment'));
    }

    const u = `/establishment/${establishment}${url}`;
    req.api(u)
      .then(response => {
        res.locals.api = response;
        res.locals.filterBy = req.query.filterBy;
        res.locals.textFilter = req.query.textFilter;
        res.locals.api.data = JSON.stringify(response.json, null, '  ');
        res.locals.establishment = response.json.meta.establishment;
        res.locals.data = response.json.data;
      })
      .then(() => next())
      .catch(e => next(e));
  };
};

module.exports = settings => {

  const app = ui(settings);

  app.static.use((req, res, next) => {
    res.locals.propositionHeader = 'Research and testing with animals';
    next();
  });

  app.use(pdf(settings));

  app.get('/roles', api(), (req, res) => {
    res.render('roles', {
      roles: res.locals.data
    });
  });

  app.get('/profile/:id', api(), (req, res) => {
    res.render('profile', {
      profile: res.locals.data
    });
  });

  app.get('/places', api(), (req, res, next) => {
    res.render('places', {
      places: res.locals.data,
      applyButton: !!req.query.apply
    });
  });

  app.get('/search', api('/places'), (req, res, next) => {
    res.render('search', {
      places: res.locals.data
    });
  });

  app.get('/', api(), (req, res) => {
    res.render('index', {
      establishment: res.locals.data,
      elh: res.locals.data.roles.find(r => r.type === 'elh')
    });
  });

  app.use(errorHandler());

  return app;

};
