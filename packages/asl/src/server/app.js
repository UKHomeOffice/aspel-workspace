const ui = require('@asl/service/ui');
const pdf = require('@asl/pdf-renderer');

const errorHandler = require('./middleware/error-handler');
const responder = require('./middleware/send-response');
const createStore = require('../create-store');
const { setUser } = require('../actions');

module.exports = settings => {

  const app = ui(settings);

  app.use(pdf(settings.pdf));

  app.use((req, res, next) => {
    res.store = createStore();
    next();
  });

  app.use((req, res, next) => {
    res.store.dispatch(setUser(req.user.get('name')));
    next();
  });

  app.use('/roles', require('./routers/roles')());
  app.use('/profile', require('./routers/profile')());
  app.use('/places', require('./routers/places')());
  app.use('/', require('./routers/home')());

  app.use(responder());
  app.use(errorHandler());

  return app;

};
