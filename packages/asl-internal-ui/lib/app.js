const ui = require('@asl/service/ui');
const { crumbs } = require('@asl/service/ui/middleware');
const {
  establishments,
  establishment,
  details,
  places,
  profile
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
      { href: '/establishment/{{establishment.id}}/profiles', label: 'Profiles' },
      '{{profile.name}}'
    ])
  );

  app.use('/establishment/:id/places',
    places(),
    crumbs([{ href: '/establishment/{{establishment.id}}', label: '{{establishment.name}}' }, 'Licenced Premises'])
  );

  app.use('/establishment/:id/details',
    details(),
    crumbs([{ href: '/establishment/{{establishment.id}}', label: '{{establishment.name}}' }, 'Establishment Details'])
  );

  app.use('/establishment/:id',
    establishment(),
    crumbs([ '{{establishment.name}}' ])
  );

  app.use('/', establishments());

  return app;
};
