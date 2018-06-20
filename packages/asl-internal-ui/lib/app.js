const ui = require('@asl/service/ui');
const { crumbs } = require('@asl/service/ui/middleware');
const { pages, content, views } = require('@asl/pages');
const {
  establishment,
  place,
  profile,
  project
} = pages;

module.exports = settings => {
  const app = ui({ ...settings, views });

  app.use(content);

  app.protect('inspector');

  app.use('/establishment/:id', (req, res, next) => {
    req.establishment = req.params.id;
    next();
  });

  app.use('/establishment/:id/profile/:profile',
    (req, res, next) => {
      req.profile = req.params.profile;
      next();
    },
    profile.view(),
    crumbs([
      { href: '/establishment/{{static.establishment.id}}', label: '{{static.establishment.name}}' },
      { href: '/establishment/{{static.establishment.id}}/people', label: '{{static.content.pages.people}}' },
      '{{profile.name}}'
    ])
  );

  app.use('/establishment/:id/people',
    profile.list(),
    crumbs([
      { href: '/establishment/{{static.establishment.id}}', label: '{{static.establishment.name}}' },
      '{{static.content.pages.people}}'
    ])
  );

  app.use('/establishment/:id/places/:place',
    (req, res, next) => {
      req.place = req.params.place;
      next();
    },
    place.view(),
    crumbs([
      { href: '/establishment/{{static.establishment.id}}', label: '{{static.establishment.name}}' },
      { href: '/establishment/{{static.establishment.id}}/places', label: '{{static.content.pages.places}}' },
      '{{item.name}}'
    ])
  );

  app.use('/establishment/:id/places',
    place.list(),
    crumbs([
      { href: '/establishment/{{static.establishment.id}}', label: '{{static.establishment.name}}' },
      '{{static.content.pages.places}}'
    ])
  );

  app.use('/establishment/:id/details',
    establishment.details(),
    crumbs([
      { href: '/establishment/{{static.establishment.id}}', label: '{{static.establishment.name}}' },
      '{{static.content.pages.details}}'
    ])
  );

  app.use('/establishment/:id/projects',
    project.list(),
    crumbs([
      { href: '/establishment/{{static.establishment.id}}', label: '{{static.establishment.name}}' },
      '{{static.content.pages.projects}}'
    ])
  );

  app.use('/establishment/:id',
    establishment.dashboard(),
    crumbs([ '{{static.establishment.name}}' ])
  );

  app.use('/', establishment.list());

  return app;
};
