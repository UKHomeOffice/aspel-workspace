const { pick, get, set } = require('lodash');
const { page } = require('@asl/service/ui');
const form = require('@asl/pages/pages/common/routers/form');
const getSchema = require('./schema');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    req.version.type = req.project.status === 'active'
      ? 'amendment'
      : 'application';
    next();
  });

  app.use((req, res, next) => {
    const authorities = get(req.project, 'openTasks[0].data.data');
    if (authorities) {
      Object.assign(req.version, pick(authorities, 'authority', 'awerb'));
    }
    next();
  });

  app.use((req, res, next) => {
    req.model = req.version;
    next();
  });

  app.use(
    form({
      configure: (req, res, next) => {
        req.form.schema = getSchema(req.version.type);
        next();
      },
      locals: (req, res, next) => {
        set(res.locals, 'static.content.buttons.submit', get(res.locals, `static.content.buttons.submit.${req.version.type}`));
        next();
      }
    })
  );

  app.post('/', (req, res, next) => {
    const values = pick(req.session.form[req.model.id].values, Object.keys(getSchema(req.version.type)));
    const json = {
      meta: {
        ...values,
        version: req.version.id
      }
    };
    Promise.resolve()
      .then(() => req.api(`/establishments/${req.establishmentId}/projects/${req.projectId}/grant`, { method: 'POST', json }))
      .then(() => res.redirect(req.buildRoute('project.version.success')))
      .catch(next);
  });

  app.use((req, res) => res.sendResponse());

  return app;
};
