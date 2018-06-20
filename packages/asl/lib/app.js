const ui = require('@asl/service/ui');
const { crumbs } = require('@asl/service/ui/middleware');
const { pages, views, content } = require('@asl/pages');
const {
  establishment,
  place,
  profile,
  project
} = pages;

module.exports = settings => {
  const app = ui({ ...settings, views });

  app.use(content);

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
    profile.view(),
    crumbs([{ href: '/people', label: '{{static.content.pages.people}}' }, '{{item.name}}'])
  );

  app.use('/places/:place',
    (req, res, next) => {
      req.place = req.params.place;
      next();
    },
    place.view(),
    crumbs([{ href: '/places', label: '{{static.content.pages.places}}' }, '{{item.name}}'])
  );

  app.use('/people',
    profile.list(),
    crumbs(['{{static.content.pages.people}}'])
  );

  app.use('/places',
    place.list(),
    crumbs(['{{static.content.pages.places}}'])
  );

  app.use('/details',
    establishment.details(),
    crumbs(['{{static.content.pages.details}}'])
  );

  app.use('/projects',
    project.list(),
    crumbs(['{{static.content.pages.projects}}'])
  );

  app.use('/', establishment.dashboard());

  return app;
};
