const ui = require('@asl/service/ui');
const pdf = require('@asl/pdf-renderer');
const errorHandler = require('./error-handler');
const responder = require('./send-response');

const createStore = require('../create-store');
const actions = require('../actions');

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
        res.store.dispatch(actions.setEstablishment(response.json.meta.establishment));
        res.data = response.json.data;
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

  app.use(pdf(settings.pdf));

  app.use((req, res, next) => {
    res.store = createStore();
    next();
  });

  app.get('/roles', api(), (req, res, next) => {
    res.template = 'roles';
    res.locals.roles = res.data;
    next();
  });

  app.get('/profile/:id', api(), (req, res, next) => {
    res.template = 'profile';
    res.locals.profile = res.data;
    next();
  });

  app.get('/places', api(), filters(), (req, res, next) => {
    res.template = 'places';
    res.pdfTemplate = 'pdf-list';
    res.store.dispatch(actions.setListItems(res.data));
    res.store.dispatch(actions.setTextFilter(req.query.filter));
    next();
  });

  app.get('/', api(), (req, res, next) => {
    res.template = 'index';
    res.store.dispatch(actions.setEstablishment(res.data));
    res.locals.elh = res.data.roles.find(r => r.type === 'elh');
    next();
  });

  app.use(responder());

  app.use(errorHandler());

  return app;

};
