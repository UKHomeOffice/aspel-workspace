const { page } = require('@asl/service/ui');
const form = require('@asl/pages/pages/common/routers/form');
const { buildModel } = require('@asl/pages/lib/utils');
const { schema, getSchemaWithInspectors } = require('./schema');
const bodyParser = require('body-parser');

module.exports = settings => {
  const app = page({
    root: __dirname,
    ...settings
  });

  app.use(bodyParser.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    req.model = buildModel(schema);
    req.model.id = 'asru-establishment';
    next();
  });

  app.use('/', form({
    model: 'asruEstablishment',
    configure: (req, res, next) => {
      getSchemaWithInspectors(req, schema)
        .then(mappedSchema => {
          req.form.schema = mappedSchema;
        })
        .then(() => next())
        .catch(next);
    }
  }));

  app.use('/', (req, res, next) => {
    return req.api('/asru')
      .then(({ json: { data, meta } }) => {
        res.locals.static.inspectors = data.filter(ae => ae.establishmentId === req.establishment.id);
        res.locals.static.baseUrl = req.baseUrl;
      })
      .then(() => next())
      .catch(next);
  });

  app.post('/delete', (req, res, next) => {

    return Promise.resolve()
      .then(() => req.api('/asru', {
        method: 'DELETE',
        json: {
          data: {
            profileId: req.body['profileId'],
            establishmentId: req.body['establishmentId']
          }
        }
      }))
      .then(() => {
        // TODO: check if we want to go est dashboard and if it works
        return res.redirect(req.buildRoute('establishment.dashboard', { establishmentId: req.establishment.id }));
        // return res.redirect(req.buildRoute('dashboard'));
      })
      .catch(next);

  });

  app.post('/', (req, res, next) => {

    return Promise.resolve()
      .then(() => req.api('/asru', {
        method: 'POST',
        json: {
          data: {
            profileId: req.session.form[req.model.id].values['inspector'],
            establishmentId: req.establishmentId
          }
        }
      }))
      .then(() => {
        // TODO: check if we want to go est dashboard and if it works
        return res.redirect(req.buildRoute('establishment.dashboard', { establishmentId: req.establishment.id }));
        // return res.redirect(req.buildRoute('dashboard'));
      })
      .catch(next);

  });

  return app;
};
