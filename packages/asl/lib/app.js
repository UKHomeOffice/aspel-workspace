const ui = require('@asl/service/ui');
const { crumbs } = require('@asl/service/ui/middleware');
const { pages, views, content } = require('@asl/pages');
const {
  establishment,
  place,
  profile,
  project
} = pages;

const urls = {
  establishment: {
    dashboard: '/',
    details: '/details'
  },
  profile: {
    list: '/people',
    view: '/profile/:profile'
  },
  project: {
    list: '/projects',
  },
  place: {
    list: '/places',
  }
};

module.exports = settings => {
  const app = ui({ ...settings, views, urls });

  app.use(content);

  app.param('profile', (req, res, next, param) => {
    req.profile = param;
    next();
  });

  app.use(urls.establishment.dashboard, (req, res, next) => {
    const establishment = req.user.get('establishment');
    if (establishment) {
      req.establishment = establishment;
      return next();
    }
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  });

  app.use(urls.profile.view,
    profile.view(),
    crumbs([{ href: '/people', label: '{{static.content.pages.profile.list}}' }, '{{model.name}}'])
  );

  app.use(urls.profile.list,
    profile.list(),
    crumbs(['{{static.content.pages.profile.list}}'])
  );

  app.use(urls.place.list,
    place(),
    crumbs(['{{static.content.pages.place.list}}'])
  );

  app.use(urls.establishment.details,
    establishment.details(),
    crumbs(['{{static.content.pages.establishment.details}}'])
  );

  app.use(urls.project.list,
    project.list(),
    crumbs(['{{static.content.pages.project.list}}'])
  );

  app.use(urls.establishment.dashboard, establishment.dashboard());

  return app;
};
