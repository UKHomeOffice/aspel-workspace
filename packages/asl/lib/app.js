const ui = require('@asl/service/ui');
const { crumbs } = require('@asl/service/ui/middleware');
const { pages, views, content, assets } = require('@asl/pages');
const {
  establishment,
  details,
  places,
  people,
  profile,
  projects,
  place
} = pages;

module.exports = settings => {
  const app = ui({ ...settings, views });

  app.use(content);
  app.static.use('/public', assets);

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
    crumbs([{ href: '/people', label: '{{static.content.pages.people}}' }, '{{item.name}}'])
  );

  app.use('/places/:place',
    (req, res, next) => {
      req.place = req.params.place;
      next();
    },
    place(),
    crumbs([{ href: '/places', label: '{{static.content.pages.places}}' }, '{{item.name}}'])
  );

  app.use('/people',
    people(),
    crumbs(['{{static.content.pages.people}}'])
  );

  app.use('/places',
    places(),
    crumbs(['{{static.content.pages.places}}'])
  );

  app.use('/details',
    details(),
    crumbs(['{{static.content.pages.details}}'])
  );

  app.use('/projects',
    projects(),
    crumbs(['{{static.content.pages.projects}}'])
  );

  app.use('/', establishment());

  return app;
};
