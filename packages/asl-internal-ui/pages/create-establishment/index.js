const { page } = require('@asl/service/ui');
const form = require('@asl/pages/pages/common/routers/form');
const { buildModel } = require('@asl/pages/lib/utils');
const schema = require('./schema');

module.exports = settings => {
  const app = page({
    root: __dirname,
    ...settings
  });

  app.use((req, res, next) => {
    req.model = buildModel(schema);
    req.model.id = 'new-establishment';
    next();
  });

  app.use(form({
    schema,
    cancelEdit: (req, res, next) => {
      delete req.session.form[req.model.id];
      return res.redirect(req.buildRoute('search', { searchType: 'establishments' }));
    }
  }));

  app.post('/', (req, res, next) => {
    const params = {
      method: 'POST',
      json: {
        data: {
          name: req.session.form[req.model.id].values.name
        }
      }
    };

    req.api(`/establishment`, params)
      .then(response => {
        delete req.session.form[req.model.id];
        const establishment = response.json.data;
        req.notification({ key: 'establishmentCreated' });
        res.redirect(req.buildRoute('establishment.dashboard', { establishmentId: establishment.id }));
      })
      .catch(next);
  });

  // prevent fallthrough to /establishments/:id route
  app.get('/', (req, res) => res.sendResponse());

  return app;
};
