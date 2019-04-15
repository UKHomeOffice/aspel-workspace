const { page } = require('@asl/service/ui');
const bodyParser = require('body-parser');
const { get, pick } = require('lodash');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    const authorities = get(req.project, 'openTasks[0].data.data');
    if (authorities) {
      Object.assign(req.version, pick(authorities, 'authority', 'awerb'));
    }
    next();
  });

  app.use((req, res, next) => {
    const establishment = req.establishment;
    res.locals.static.basename = req.buildRoute('project.version.update');
    res.locals.static.establishments = req.user.profile.establishments.filter(e => e.id !== establishment.id);
    res.locals.static.establishment = establishment;
    res.locals.model = req.version;
    next();
  });

  app.put('/', bodyParser.json({ limit: '5mb' }));

  app.put('/', (req, res, next) => {
    const opts = {
      method: 'PUT',
      json: {
        data: {
          patch: req.body
        }
      }
    };
    req.api(`/establishments/${req.establishmentId}/projects/${req.projectId}/project-versions/${req.version.id}/patch`, opts)
      .then(() => res.json({}))
      .catch(next);
  });

  app.use((req, res, next) => res.sendResponse());

  return app;
};
