const { page } = require('@asl/service/ui');
const form = require('@asl/pages/pages/common/routers/form');
const { schema, getSchemaWithInspectors } = require('./schema');
const { buildModel } = require('@asl/pages/lib/utils');

module.exports = settings => {
  const app = page({
    root: __dirname,
    ...settings
  });

  // app.use('/', (req, res, next) => {
  //   req.breadcrumb('establishment.inspectors');
  //   next();
  // });

  app.use((req, res, next) => {
    req.model = buildModel(schema);
    req.model.id = `inspectors`;
    next();
  });

  app.use(
    '/',
    form({
      model: 'profile',
      configure: (req, res, next) => {
        getSchemaWithInspectors(req)
          .then(mappedSchema => {
            req.form.schema = mappedSchema;
          })
          .then(() => next())
          .catch(next);
      }
    })
  );

  app.post('/', (req, res, next) => {
    console.log('POST');
    console.log(JSON.stringify(req.session.form));
    console.log(req.establishmentId);

    const values = req.session.form[req.model.id].values['inspectors'].map(id => ({
      profileId: id,
      establishmentId: req.establishmentId
    }));

    const opts = {
      method: 'PUT',
      json: { data: values }
    };

    // console.log('ASL-INTERNAL-UI : invoke req.api with values >>> ', JSON.stringify(values));
    console.log('ASL-INTERNAL-UI : invoke req.api with values >>> ', values);

    return req.api(`/establishment/${req.establishmentId}/profile/assign`, opts)
      .then(() => res.redirect(req.buildRoute('establishment.inspectors')))
      .catch(next);
  });

  return app;
};
