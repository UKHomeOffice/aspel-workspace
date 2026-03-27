const { form } = require('../../../common/routers');
const { Router } = require('express');
const schema = require('../schema').mandatoryTraining;
const { ROLE_TYPES, normalizeRoleType } = require('../role-types');

module.exports = ({ formId }) => {
  const app = Router({ mergeParams: true });

  app.use(
    form({
      configure(req, res, next) {
        const role =
          req.session.form[formId].values;
        req.form.schema = schema(role);
        next();
      },
      getValidationErrors: (req, res, next) => {
        const role = req.session.form[formId].values;
        const roleType = normalizeRoleType(role.type);

        if (roleType === ROLE_TYPES.sqp && req.form.validationErrors?.mandatory === 'required') {
          req.form.validationErrors.mandatory = 'requiredRadioGroup';
        }

        next();
      },
      locals: (req, res, next) => {
        Object.assign(res.locals.static, {
          profile: req.profile,
          role: {
            ...req.session.form[formId].values
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
