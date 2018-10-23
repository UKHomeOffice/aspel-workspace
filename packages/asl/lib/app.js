const ui = require('@asl/service/ui');
const { crumbs } = require('@asl/service/ui/middleware');
const { pages, views, content } = require('@asl/pages');
const {
  dashboard,
  establishment,
  place,
  profile,
  project,
  pil,
  user
} = pages;

const urls = {
  dashboard: '/',
  account: {
    menu: '/profile',
    edit: '/profile/edit'
  },
  establishment: {
    dashboard: '/e/:establishment',
    read: '/e/:establishment/details'
  },
  profile: {
    list: '/e/:establishment/people',
    view: '/e/:establishment/people/:profile',
    invite: '/e/:establishment/people/invite',
  },
  project: {
    list: '/e/:establishment/projects'
  },
  place: {
    list: '/e/:establishment/places',
    create: {
      create: '/e/:establishment/places/create',
      confirm: '/e/:establishment/places/create/confirm',
      success: '/e/:establishment/places/create/success'
    },
    delete: {
      confirm: '/e/:establishment/places/:id/delete/confirm',
      success: '/e/:establishment/places/:id/delete/success'
    },
    update: {
      confirm: '/e/:establishment/places/:id/edit/confirm',
      success: '/e/:establishment/places/:id/edit/success'
    }
  },
  pil: {
    categories: '/e/:establishment/people/:profile/pil',
    application: '/e/:establishment/people/:profile/pil/:pil',
    details: '/e/:establishment/people/:profile',
    training: '/e/:establishment/people/:profile/pil/:pil/training',
    exemptions: '/e/:establishment/people/:profile/pil/:pil/exemptions',
    procedures: '/e/:establishment/people/:profile/pil/:pil/procedures',
    success: '/e/:establishment/people/:profile/pil/:pil/success',
    trainingModules: '/e/:establishment/people/:profile/pil/:pil/training/modules',
    exemptionModules: '/e/:establishment/people/:profile/pil/:pil/exemptions/modules'
  }
};

module.exports = settings => {
  const app = ui({ ...settings, views, urls });

  app.use(content);

  app.param('profile', (req, res, next, param) => {
    req.profileId = param;
    next();
  });

  app.param('establishment', (req, res, next, param) => {
    if (req.user.profile) {
      const establishments = req.user.profile.establishments || [];
      const establishment = establishments.find(e => e.id.toString() === param);
      if (establishment) {
        req.establishmentId = establishment.id;
        return next();
      }
    }
    const err = new Error('Not found');
    err.status = 404;
    next(err);
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
    crumbs(['{{static.content.pages.pil.categories}}'])
  );

  app.use(urls.account.menu, user());

  app.use(urls.dashboard, dashboard());

  return app;
};
