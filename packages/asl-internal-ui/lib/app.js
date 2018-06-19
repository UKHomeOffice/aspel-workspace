const ui = require('@asl/service/ui');
const { crumbs } = require('@asl/service/ui/middleware');
const { pages, assets, content, views } = require('@asl/pages');
const {
  establishment: {
    details,
    dashboard,
    list: establishments
  },
  place: {
    list: places,
    view: place
  },
  profile: {
    list: people,
    view: profile
  },
  project: {
    list: projects
  }
} = pages;

module.exports = settings => {
  const app = ui({ ...settings, views });

  app.use(content);
  app.static.use('/public', assets);

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
    profile(),
    crumbs([
      { href: '/establishment/{{static.establishment.id}}', label: '{{static.establishment.name}}' },
      { href: '/establishment/{{static.establishment.id}}/people', label: '{{static.content.pages.people}}' },
      '{{profile.name}}'
    ])
  );

  app.use('/establishment/:id/places/:place',
    (req, res, next) => {
      req.place = req.params.place;
      next();
    },
    place(),
    crumbs([
      { href: '/establishment/{{static.establishment.id}}', label: '{{static.establishment.name}}' },
      { href: '/establishment/{{static.establishment.id}}/places', label: '{{static.content.pages.places}}' },
      '{{item.name}}'
    ])
  );

  app.use('/establishment/:id/places',
    places(),
    crumbs([{ href: '/establishment/{{static.establishment.id}}', label: '{{static.establishment.name}}' }, '{{static.content.pages.places}}'])
  );

  app.use('/establishment/:id/people',
    people(),
    crumbs([{ href: '/establishment/{{static.establishment.id}}', label: '{{static.establishment.name}}' }, '{{static.content.pages.people}}'])
  );

  app.use('/establishment/:id/details',
    details(),
    crumbs([{ href: '/establishment/{{static.establishment.id}}', label: '{{static.establishment.name}}' }, '{{static.content.pages.details}}'])
  );

  app.use('/establishment/:id/projects',
    projects(),
    crumbs([{ href: '/establishment/{{static.establishment.id}}', label: '{{static.establishment.name}}' }, '{{static.content.pages.projects}}'])
  );

  app.use('/establishment/:id',
    dashboard(),
    crumbs([ '{{static.establishment.name}}' ])
  );

  app.use('/', establishments());

  return app;
};
