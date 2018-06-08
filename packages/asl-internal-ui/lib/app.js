const ui = require('@asl/service/ui');
const { crumbs } = require('@asl/service/ui/middleware');
const {
  establishments,
  establishment,
  details,
  places,
  people,
  profile,
  place
} = require('@asl/service/pages');

module.exports = settings => {
  const app = ui(settings);

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
      { href: '/establishment/{{establishment.id}}', label: '{{establishment.name}}' },
      { href: '/establishment/{{establishment.id}}/people', label: '{{content.pages.people}}' },
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
      { href: '/establishment/{{establishment.id}}', label: '{{establishment.name}}' },
      { href: '/establishment/{{establishment.id}}/places', label: '{{content.pages.places}}' },
      '{{item.name}}'
    ])
  );

  app.use('/establishment/:id/places',
    places(),
    crumbs([{ href: '/establishment/{{establishment.id}}', label: '{{establishment.name}}' }, '{{content.pages.places}}'])
  );

  app.use('/establishment/:id/people',
    people(),
    crumbs([{ href: '/establishment/{{establishment.id}}', label: '{{establishment.name}}' }, '{{content.pages.people}}'])
  );

  app.use('/establishment/:id/details',
    details(),
    crumbs([{ href: '/establishment/{{establishment.id}}', label: '{{establishment.name}}' }, '{{content.pages.details}}'])
  );

  app.use('/establishment/:id',
    establishment(),
    crumbs([ '{{establishment.name}}' ])
  );

  app.use('/', establishments());

  return app;
};
