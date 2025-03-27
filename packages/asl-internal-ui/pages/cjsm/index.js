const { page } = require('@asl/service/ui');
const { form } = require('@asl/pages/pages/common/routers');
const schema = require('./schema');

module.exports = () => {
  const app = page({
    root: __dirname
  });

  app.use((req, res, next) => {
    req.model = req.establishment;
    next();
  });

  app.use(form({ schema }));

  app.post('/', (req, res, next) => {
    const { cjsmEmail } = req.form.values;
    const params = {
      method: 'PUT',
      json: {
        data: {
          cjsmEmail: cjsmEmail || null
        }
      }
    };
    req.api(`/establishment/${req.establishmentId}`, params)
      .then(() => {
        req.notification({ key: 'success' });
        delete req.session.form[req.model.id];
        res.redirect(req.buildRoute('establishment.dashboard'));
      })
      .catch(next);
  });

  return app;
};
