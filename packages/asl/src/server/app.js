const ui = require('@asl/service/ui');
const pdf = require('@asl/pdf-renderer');

const api = require('./middleware/api');
const errorHandler = require('./middleware/error-handler');
const responder = require('./middleware/send-response');

const createStore = require('../create-store');
const actions = require('../actions');
const Tables = require('../schema');

const listRouter = require('./routers/list');

module.exports = settings => {

  const app = ui(settings);

  app.use(pdf(settings.pdf));

  app.use((req, res, next) => {
    res.store = createStore();
    next();
  });

  app.get('/roles', api(), listRouter({ template: 'roles', schema: Tables.roles }));

  app.get('/profile/:id', api(), (req, res, next) => {
    res.template = 'profile';
    res.store.dispatch(actions.setSchema(Tables.places));
    res.store.dispatch(actions.setProfile(res.data));
    next();
  });

  app.get('/places', api(), listRouter({ template: 'places', schema: Tables.places }), (req, res, next) => {
    res.pdfTemplate = 'pdf/places';
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
