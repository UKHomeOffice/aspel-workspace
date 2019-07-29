const { pick, get, set, reduce, omit } = require('lodash');
const { page } = require('@asl/service/ui');
const form = require('@asl/pages/pages/common/routers/form');
const getSchema = require('./schema');

const revealedFields = schema => {
  return reduce(schema, (obj, declaration) => {
    if (declaration.options) {
      declaration.options.map(option => option.reveal && option.reveal.map(field => {
        obj[field.name] = omit(field, 'name');
      }));
    }
    return obj;
  }, {});
};

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname
  });

  app.use((req, res, next) => {
    req.version.type = req.project.status === 'active' ? 'amendment' : 'application';
    next();
  });

  app.use((req, res, next) => {
    const declarations = get(req.project, 'openTasks[0].data.meta');
    if (declarations) {
      Object.assign(req.version, pick(declarations, [
        'authority',
        'awerb',
        'ready',
        'authority-pelholder-name',
        'authority-endorsement-date',
        'awerb-review-date',
        'awerb-no-review-reason'
      ]));
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
        const schema = getSchema(req.version.type);

        req.form.schema = {
          ...schema,
          ...revealedFields(schema)
        };

        next();
      },
      locals: (req, res, next) => {
        set(res.locals, 'static.content.buttons.submit', get(res.locals, `static.content.buttons.submit.${req.version.type}`));
        const schema = getSchema(req.version.type);
        res.locals.static.schema = omit(req.form.schema, Object.keys(revealedFields(schema)));
        next();
      }
    })
  );

  app.post('/', (req, res, next) => {
    const values = pick(req.session.form[req.model.id].values, Object.keys(req.form.schema));
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
