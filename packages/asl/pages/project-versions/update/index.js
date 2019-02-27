const { page } = require('@asl/service/ui');
const bodyParser = require('body-parser');
const { omit } = require('lodash');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    req.api(`/establishments/${req.establishmentId}/projects/${req.projectId}/project-versions/${req.versionId}`)
      .then(({ json: { data } }) => {
        req.model = data;
      })
      .then(() => next())
      .catch(next);
  });

  app.use((req, res, next) => {
    res.locals.static.basename = req.buildRoute('project.version');
    res.locals.static.establishments = req.user.profile.establishments;
    res.locals.scripts = ['/public/js/project/bundle.js'];
    res.locals.model = req.model;
    res.template = require('./views/index.jsx').default;
    next();
  });

  app.put('/', bodyParser.json());

  app.put('/', (req, res, next) => {
    const opts = {
      method: 'PUT',
      json: {
        data: {
          data: omit(req.body, 'id')
        }
      }
    };
    req.api(`/establishments/${req.establishmentId}/projects/${req.projectId}/project-versions/${req.model.id}`, opts)
      .then(() => next())
      .catch(next);
  });

  return app;
};
