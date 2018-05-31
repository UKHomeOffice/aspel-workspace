const ui = require('@asl/service/ui');
const { crumbs } = require('@asl/service/ui/middleware');
const {
  establishment,
  details,
  places,
  people,
  profile
} = require('@asl/service/pages');

module.exports = settings => {
  const app = ui(settings);

  app.use('/', (req, res, next) => {
    const establishment = req.user.get('establishment');
    if (establishment) {
      req.establishment = establishment;
      return next();
    }
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  });

  app.use('/profile/:profile',
    (req, res, next) => {
      req.profile = req.params.profile;
      next();
    },
    profile(),
    crumbs([{ href: '/people', label: '{{content.pages.people}}' }, '{{profile.name}}'])
  );

  app.use('/people',
    people(),
    crumbs(['{{content.pages.people}}'])
  );

  app.use('/places',
    places(),
    crumbs(['{{content.pages.places}}'])
  );

  app.use('/details',
    details(),
    crumbs(['{{content.pages.details}}'])
  );

  app.use('/', establishment());

  return app;
};
