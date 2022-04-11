const { get, isEmpty } = require('lodash');
const { page } = require('@asl/service/ui');
const { buildModel } = require('@asl/pages/lib/utils');
const form = require('@asl/pages/pages/common/routers/form');
const schema = require('./schema');

module.exports = settings => {
  const app = page({
    root: __dirname,
    ...settings
  });

  app.use((req, res, next) => {
    req.model = buildModel(schema);
    req.model.id = 'new-enforcement';
    next();
  });

  app.use(form({
    schema,
    validate: (req, res, next) => {
      const caseNumber = get(req, `form.values.caseNumber`) || '';

      return req.api('/enforcement', { query: { search: caseNumber.trim() } })
        .then(({ json: { data } }) => {
          if (!isEmpty(data)) {
            return next({ validation: { caseNumber: 'notUnique' } });
          }
        })
        .then(() => next())
        .catch(next);
    },
    cancelEdit: (req, res, next) => {
      delete req.session.form[req.model.id];
      return res.redirect(req.buildRoute('enforcement.list'));
    }
  }));

  app.post('/', (req, res, next) => {
    const params = {
      method: 'POST',
      json: {
        data: {
          caseNumber: get(req.session, `form[${req.model.id}].values.caseNumber`)
        }
      }
    };

    req.api(`/enforcement`, params)
      .then(response => {
        delete req.session.form[req.model.id];
        const task = response.json.data;
        req.notification({ key: 'success' });
        res.redirect(req.buildRoute('enforcement.update', { caseId: task.data.id }));
      })
      .catch(next);
  });

  // prevent fallthrough to /enforcement/:caseId route
  app.get('/', (req, res) => res.sendResponse());

  return app;
};
