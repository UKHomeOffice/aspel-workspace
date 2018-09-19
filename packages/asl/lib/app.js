const ui = require('@asl/service/ui');
const { crumbs } = require('@asl/service/ui/middleware');
const { pages, views, content } = require('@asl/pages');
const {
  dashboard,
  establishment,
  place,
  profile,
  project,
  pil
} = pages;

const urls = {
  dashboard: '/',
  establishment: {
    dashboard: '/e/:establishment',
    read: '/e/:establishment/details'
  },
  profile: {
    list: '/e/:establishment/people',
    view: '/e/:establishment/people/:profile',
    invite: '/e/:establishment/people/invite'
  },
  project: {
    list: '/e/:establishment/projects'
  },
  place: {
    list: '/e/:establishment/places',
    create: '/e/:establishment/places/create'
  },
  pil: {
    categories: '/e/:establishment/people/:profile/pil',
    dashboard: '/e/:establishment/people/:profile/pil/:pilid',
    details: '/e/:establishment/people/:profile',
    training: '/e/:establishment/people/:profile/pil/:pilid/training',
    // modules: '/e/:establishment/pil/:pilid/modules',
    exemptions: '/e/:establishment/people/:profile/pil/:pilid/exemptions',
    procedures: '/e/:establishment/people/:profile/pil/:pilid/procedures'
  }
};

module.exports = settings => {
  const app = ui({ ...settings, views, urls });

  app.use(content);

  app.param('profile', (req, res, next, param) => {
    req.profile = param;
    next();
  });

  app.param('establishment', (req, res, next, param) => {
    if (req.user.profile) {
      const establishments = req.user.profile.establishments || [];
      const establishment = establishments.find(e => e.id.toString() === param);
      if (establishment) {
        req.establishment = establishment.id;
        return next();
      }
    }
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  });

  app.param('pilid', (req, res, next, param) => {
    req.id = param;
    next();
  });

  app.use(urls.profile.list,
    profile(),
    crumbs(['{{static.content.pages.profile.list}}'])
  );

  app.use(urls.place.list,
    place(),
    crumbs(['{{static.content.pages.place.list}}'])
  );

  app.use(urls.establishment.read,
    establishment.details(),
    crumbs(['{{static.content.pages.establishment.details}}'])
  );

  app.use(urls.project.list,
    project.list(),
    crumbs(['{{static.content.pages.project.list}}'])
  );

  app.use(urls.establishment.dashboard, establishment.dashboard());

  app.use(urls.pil.categories,
    pil(),
    crumbs(['{{static.content.pages.pil.categories}}']));

  app.use(urls.dashboard, dashboard());
  return app;
};
