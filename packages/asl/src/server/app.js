const ui = require('@asl/service/ui');
const pdf = require('@asl/pdf-renderer');

const api = require('./middleware/api');
const errorHandler = require('./middleware/error-handler');
const responder = require('./middleware/send-response');

const createStore = require('../create-store');
const actions = require('../actions');
const { places, roles } = require('../schema');


module.exports = settings => {

  const app = ui(settings);

  app.use(pdf(settings.pdf));

  app.use((req, res, next) => {
    res.store = createStore();
    next();
  });

  app.get('/roles', api(), (req, res, next) => {
    res.template = 'roles';
    res.store.dispatch(actions.setSchema(roles));
    res.store.dispatch(actions.setListItems(res.data));
    res.store.dispatch(actions.setTextFilter(req.query.filter));
    res.store.dispatch(actions.setSort(req.query.sort));
    next();
  });

  app.get('/profile/:id', api(), (req, res, next) => {
    res.template = 'profile';
    res.store.dispatch(actions.setSchema(places));
    res.store.dispatch(actions.setProfile(res.data));
    next();
  });

  app.get('/places', api(), (req, res, next) => {
    res.template = 'places';
    res.pdfTemplate = 'pdf/places';
    res.store.dispatch(actions.setSchema(places));
    res.store.dispatch(actions.setListItems(res.data));
    res.store.dispatch(actions.setTextFilter(req.query.filter));
    res.store.dispatch(actions.setSort(req.query.sort));
    next();
  });

  app.get('/', api(), (req, res, next) => {
    res.template = 'index';
    res.store.dispatch(actions.setEstablishment(res.data));
    next();
  });

  app.use(responder());

  app.use(errorHandler());

  return app;

};
