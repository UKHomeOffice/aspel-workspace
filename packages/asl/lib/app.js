const ui = require('@asl/service/ui');
const { crumbs } = require('@asl/service/ui/middleware');
const {
  establishment,
  details,
  places,
  people,
  profile,
  projects,
  place
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
    crumbs([{ href: '/people', label: '{{content.pages.people}}' }, '{{item.name}}'])
  );

  app.use('/places/:place',
    (req, res, next) => {
      req.place = req.params.place;
      next();
    },
    place(),
    crumbs([{ href: '/places', label: '{{content.pages.places}}' }, '{{item.name}}'])
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

  app.use('/projects',
    projects(),
    crumbs(['{{content.pages.projects}}'])
  );

  app.use('/', establishment());

  return app;
};
