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
    dashboard: '/e/:establishmentId',
    read: '/e/:establishmentId/details'
  },
  profile: {
    list: '/e/:establishmentId/people',
    view: '/e/:establishmentId/people/:profileId',
    invite: '/e/:establishmentId/people/invite'
  },
  project: {
    list: '/e/:establishmentId/projects'
  },
  place: {
    list: '/e/:establishmentId/places',
    create: {
      new: '/e/:establishmentId/places/create',
      confirm: '/e/:establishmentId/places/create/confirm',
      success: '/e/:establishmentId/places/create/success'
    },
    delete: {
      confirm: '/e/:establishmentId/places/:placeId/delete/confirm',
      success: '/e/:establishmentId/places/:placeId/delete/success'
    },
    update: {
      confirm: '/e/:establishmentId/places/:placeId/edit/confirm',
      success: '/e/:establishmentId/places/:placeId/edit/success'
    }
  },
  pil: {
    base: '/e/:establishmentId/people/:profileId/pil',
    create: '/e/:establishmentId/people/:profileId/pil/create',
    read: '/e/:establishmentId/people/:profileId/pil/:pilId',
    update: '/e/:establishmentId/people/:profileId/pil/:pilId/edit',
    procedures: '/e/:establishmentId/people/:profileId/pil/:pilId/edit/procedures',
    training: {
      exempt: '/e/:establishmentId/people/:profileId/pil/:pilId/edit/training/exempt',
      certificate: '/e/:establishmentId/people/:profileId/pil/:pilId/edit/training',
      modules: '/e/:establishmentId/people/:profileId/pil/:pilId/edit/training/modules'
    },
    exemptions: {
      exempt: '/e/:establishmentId/people/:profileId/pil/:pilId/edit/exemptions',
      modules: '/e/:establishmentId/people/:profileId/pil/:pilId/edit/exemptions/modules'
    },
    success: '/e/:establishmentId/people/:profileId/pil/:pilId/edit/success'
  }
};

module.exports = settings => {
  const app = ui({ ...settings, views, urls });

  app.use(content);

  app.param('profileId', (req, res, next, param) => {
    req.profileId = param;
    next();
  });

  app.param('establishmentId', (req, res, next, param) => {
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

  app.use(urls.pil.base,
    pil(),
    crumbs(['{{static.content.pages.pil.categories}}'])
  );

  app.use(urls.account.menu, user());

  app.use(urls.dashboard, dashboard());

  return app;
};
