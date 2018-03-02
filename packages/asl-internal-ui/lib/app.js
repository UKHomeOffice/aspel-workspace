const ui = require('@asl/service/ui');
const errorHandler = require('./error-handler');

module.exports = settings => {

  const app = ui(settings);

  app.static.use((req, res, next) => {
    res.locals.propositionHeader = 'Animal Science Inspection';
    next();
  });

  app.protect('inspector');

  app.use((req, res, next) => {
    req.api('/establishments')
      .then(response => {
        res.locals.api = response;
        res.locals.api.data = JSON.stringify(response.json, null, '  ');
      })
      .then(() => next())
      .catch(e => next(e));

  });

  app.get('/', (req, res) => {
    res.render('index');
  });

  app.use(errorHandler());

  return app;

};
