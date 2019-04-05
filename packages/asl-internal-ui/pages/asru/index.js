const bodyParser = require('body-parser');
const { page } = require('@asl/service/ui');
const { buildModel } = require('@asl/pages/lib/utils');
const form = require('@asl/pages/pages/common/routers/form');
const { schema, getSchemaWithInspectors, getSchemaWithSpocs } = require('./schema');

module.exports = settings => {
  const app = page({
    root: __dirname,
    ...settings
  });

  app.use(bodyParser.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    req.model = buildModel(schema);
    req.model.id = 'asru-establishment';
    res.locals.static.baseUrl = req.baseUrl;
    res.locals.static.estId = req.establishment.id;
    req.asruUser === 'inspectors'
      ? res.locals.static.asru = req.establishment.asru.filter(
        p => p.asruInspector
      ) : res.locals.static.asru = req.establishment.asru.filter(
        p => p.asruLicensing
      );
    next();
  }, form({
    model: 'asruEstablishment',
    configure: (req, res, next) => {
      req.asruUser === 'inspectors'
        ? getSchemaWithInspectors(req, schema)
          .then(mappedSchema => {
            req.form.schema = mappedSchema;
          })
          .then(() => next())
          .catch(next)
        : getSchemaWithSpocs(req, schema)
          .then(mappedSchema => {
            req.form.schema = mappedSchema;
          })
          .then(() => next())
          .catch(next);
    }
  }));

  app.post('/delete', (req, res, next) => {
    return Promise.resolve()
      .then(() => req.api('/asru', {
        method: 'DELETE',
        json: {
          data: {
            profileId: req.body['profileId'],
            establishmentId: req.establishmentId
          }
        }
      }))
      .then(() => {
        return res.redirect(req.buildRoute('establishment.dashboard', { establishmentId: req.establishment.id }));
      })
      .catch(next);

  });

  app.post('/', (req, res, next) => {
    return Promise.resolve()
      .then(() => req.api('/asru', {
        method: 'POST',
        json: {
          data: {
            profileId: req.session.form[req.model.id].values['asru'],
            establishmentId: req.establishmentId
          }
        }
      }))
      .then(() => {
        return res.redirect(req.buildRoute('establishment.dashboard', { establishmentId: req.establishment.id }));
      })
      .catch(next);

  });

  return app;
};
