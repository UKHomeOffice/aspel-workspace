const { form } = require('../../../common/routers');
const { Router } = require('express');
const schema = require('../schema').mandatoryTraining;

const getMandatoryTrainingFormId = (req) => `${req.profile.id}-mandatory-training`;

module.exports = ({ formId }) => {
  const app = Router({ mergeParams: true });

  app.use((req, res, next) => {
    req.model = {
      ...req.model,
      id: getMandatoryTrainingFormId(req)
    };
    next();
  });

  app.use(
    form({
      configure(req, res, next) {
        const role =
          req.session.form[formId].values;
        req.form.schema = schema(role);
        next();
      },
      locals: (req, res, next) => {
        Object.assign(res.locals.static, {
          profile: req.profile,
          role: {
            ...req.session.form[formId]
              .values
          }
        });
        next();
      }
    })
  );

  app.post('/', (req, res, next) => {
    const { mandatory } = req.form.values;
    if (mandatory === 'yes' || mandatory === 'exemption') {
      return res.redirect(req.buildRoute('role.namedPersonMvp.confirm'));
    }
    if (
      mandatory === 'delay' ||
      (Array.isArray(mandatory) && mandatory.includes('delay'))
    ) {
      return res.redirect(
        req.buildRoute('role.namedPersonMvp.incompleteTraining')
      );
    }
  });

  return app;
};
