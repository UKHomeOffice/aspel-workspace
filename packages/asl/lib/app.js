const ui = require('@asl/service/ui');
const { crumbs } = require('@asl/service/ui/middleware');
const {
  establishment,
  details,
  places,
  people
} = require('@asl/service/pages');

module.exports = settings => {
  const app = ui(settings);

  app.use('/', (req, res, next) => {
    req.establishment = req.user.get('establishment');
    next();
  });

  app.use('/people',
    people(),
    crumbs(['Named people and licence holders'])
  );

  app.use('/places',
    places(),
    crumbs(['Licenced Premises'])
  );

  app.use('/details',
    details(),
    crumbs(['Establishment Details'])
  );

  app.use('/', establishment());

  return app;
};
