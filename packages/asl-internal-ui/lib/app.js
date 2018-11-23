const ui = require('@asl/service/ui');
const { crumbs } = require('@asl/service/ui/middleware');
const { NotAuthorisedError } = require('./errors');
const { pages, content, views } = require('@asl/pages');
const {
  establishment,
  place,
  profile,
  project,
  user,
  feedback
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
    dashboard: '/establishment/:establishmentId',
    read: '/establishment/:establishmentId/details'
  },
  profile: {
    list: '/establishment/:establishmentId/people',
    view: '/establishment/:establishmentId/people/:profileId'
  },
  project: {
    list: '/establishment/:establishmentId/projects'
  },
  place: {
    list: '/establishment/:establishmentId/places'
  },
  feedback: '/feedback'
};

module.exports = settings => {
  const app = ui({ ...settings, views, urls });

  app.use((req, res, next) => {
    if (!req.user || !req.user.profile || !req.user.profile.asruUser) {
      return next(new NotAuthorisedError());
    }
    next();
  });

  app.use(content);

  app.param('profileId', (req, res, next, param) => {
    req.profileId = param;
    next();
  });

  app.param('establishmentId', (req, res, next, param) => {
    req.establishmentId = param;
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
  app.use(urls.feedback, feedback(settings));

  return app;
};
