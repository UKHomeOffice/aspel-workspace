const ui = require('@asl/service/ui');
const { crumbs } = require('@asl/service/ui/middleware');
const { pages, content, views } = require('@asl/pages');
const {
  establishment,
  place,
  profile,
  project
} = pages;

const urls = {
  establishment: {
    list: '/',
    dashboard: '/establishment/:establishment',
    details: '/establishment/:establishment/details'
  },
  profile: {
    list: '/establishment/:establishment/people',
    view: '/establishment/:establishment/profile/:profile'
  },
  project: {
    list: '/establishment/:establishment/projects'
  },
  place: {
    list: '/establishment/:establishment/places'
  }
};

module.exports = settings => {
  const app = ui({ ...settings, views, urls });

  app.use(content);

  app.protect('inspector');

  app.param('establishment', (req, res, next, param) => {
    req.establishment = param;
    next();
  });

  app.param('profile', (req, res, next, param) => {
    req.profile = param;
    next();
  });

  app.use(urls.profile.view,
    profile.view(),
    crumbs([
      { href: '/establishment/{{static.establishment.id}}', label: '{{static.establishment.name}}' },
      { href: '/establishment/{{static.establishment.id}}/people', label: '{{static.content.pages.profile.list}}' },
      '{{model.name}}'
    ])
  );

  app.use(urls.profile.list,
    profile.list(),
    crumbs([
      { href: '/establishment/{{static.establishment.id}}', label: '{{static.establishment.name}}' },
      '{{static.content.pages.profile.list}}'
    ])
  );

  app.use(urls.place.list,
    place(),
    crumbs([
      { href: '/establishment/{{static.establishment.id}}', label: '{{static.establishment.name}}' },
      '{{static.content.pages.place.list}}'
    ])
  );

  app.use(urls.establishment.details,
    establishment.details(),
    crumbs([
      { href: '/establishment/{{static.establishment.id}}', label: '{{static.establishment.name}}' },
      '{{static.content.pages.establishment.details}}'
    ])
  );

  app.use(urls.project.list,
    project.list(),
    crumbs([
      { href: '/establishment/{{static.establishment.id}}', label: '{{static.establishment.name}}' },
      '{{static.content.pages.project.list}}'
    ])
  );

  app.use(urls.establishment.dashboard,
    establishment.dashboard(),
    crumbs([ '{{static.establishment.name}}' ])
  );

  app.use(urls.establishment.list, establishment.list());

  return app;
};
