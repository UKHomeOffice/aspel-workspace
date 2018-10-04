const ui = require('@asl/service/ui');
const { crumbs } = require('@asl/service/ui/middleware');
const { NotAuthorisedError } = require('./errors');
const { pages, content, views } = require('@asl/pages');
const {
  establishment,
  place,
  profile,
  project,
  user
} = pages;

const dashboard = require('../pages/dashboard');

const urls = {
  dashboard: '/',
  account: {
    menu: '/profile',
    edit: '/profile/edit'
  },
  establishment: {
    list: '/establishments',
    dashboard: '/establishment/:establishment',
    read: '/establishment/:establishment/details'
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

  app.use((req, res, next) => {
    if (!req.user || !req.user.profile || !req.user.profile.asru_user) {
      return next(new NotAuthorisedError());
    }
    next();
  });

  app.use(content);

  app.param('profile', (req, res, next, param) => {
    req.profile = param;
    next();
  });

  app.param('establishment', (req, res, next, param) => {
    req.establishment = param;
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

  app.use(urls.establishment.list, establishment.list());

  app.use(urls.account.menu, user());

  app.use(urls.dashboard, dashboard(settings));

  return app;
};
