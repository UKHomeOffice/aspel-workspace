const { page } = require('@asl/service/ui');
const downloads = require('./downloads');

const types = [
  'project-application',
  'project-amendment',
  'project-revoke',
  'project-transfer',
  'pil-application',
  'pil-amendment',
  'pil-revoke',
  'pil-transfer',
  'role-create',
  'role-delete',
  'place-update',
  'place-create',
  'place-delete',
  'profile-update'
];

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.get('/', (req, res, next) => {
    const since = req.query.since || '2019-07-01';
    req.api(`/metrics?since=${since}`)
      .then(response => {
        res.locals.static.since = since;
        res.locals.static.metrics = response.json;
        res.locals.static.types = types;
        next();
      })
      .catch(next);

  });

  app.use(downloads({ types }));

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
