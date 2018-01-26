const ui = require('asl-service/ui');

const errorHandler = require('./error-handler');

module.exports = settings => {

  const app = ui(settings);

  app.static.use((req, res, next) => {
    res.locals.propositionHeader = 'Animal Science Licensing';
    next();
  });

  app.get('/', (req, res) => {
    res.render('index', {
      name: req.user.get('name'),
      establishment: req.user.get('establishment'),
      isInspector: req.user.is('inspector')
    });
  });

  app.use(errorHandler());

  return app;

};
