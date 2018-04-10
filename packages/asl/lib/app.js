const ui = require('@asl/service/ui');
const pdf = require('@asl/pdf-renderer');
const errorHandler = require('./error-handler');
const responder = require('./send-response');

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
        res.locals.establishment = response.json.meta.establishment;
        res.locals.data = response.json.data;
      })
      .then(() => next())
      .catch(e => next(e));
  };
};

const filters = () => {
  return (req, res, next) => {
    res.locals.filter = req.query.filter;
    next();
  };
};

module.exports = settings => {

  const app = ui(settings);

  app.static.use((req, res, next) => {
    res.locals.propositionHeader = 'Research and testing with animals';
    next();
  });

  app.use(pdf(settings.pdf));


  app.get('/roles', api(), (req, res, next) => {
    res.template = 'roles';
    res.locals.roles = res.locals.data;
    next();
  });

  app.get('/profile/:id', api(), (req, res, next) => {
    res.template = 'profile';
    res.locals.profile = res.locals.data;
    next();
  });

  app.get('/places', api(), filters(), (req, res, next) => {
    res.template = 'places';
    res.locals.list = { all: res.locals.data, filter: res.locals.filter };
    next();
  });

  app.get('/', api(), (req, res, next) => {
    res.template = 'index';
    res.locals.establishment = res.locals.data;
    res.locals.elh = res.locals.data.roles.find(r => r.type === 'elh');
    next();
  });

  app.use((req, res, next) => {
    if (req.query.pdf && res.locals.list) {
      res.template = 'pdf-list';
    }
    next();
  });

  app.use(responder());

  app.use(errorHandler());

  return app;

};
