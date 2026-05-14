const { form } = require('../../../common/routers');
const { Router } = require('express');
const schema = require('../schema').skillsAndExperience;
const { ROLE_TYPES, normalizeRoleType } = require('../role-types');

module.exports = ({ formId }) => {
  const app = Router({ mergeParams: true });

  app.use(
    form({
      configure(req, res, next) {
        const roleType = req.session.form[formId].values.type;
        req.form.schema = schema(roleType);
        next();
      },
      getValidationErrors: (req, res, next) => {
        const roleType = normalizeRoleType(req.session.form[formId].values.type);

        if (roleType === ROLE_TYPES.ntco) {
          if (req.form.validationErrors?.experience === 'required') {
            req.form.validationErrors.experience = 'requiredNtco';
          }
          if (req.form.validationErrors?.communication === 'required') {
            req.form.validationErrors.communication = 'requiredNtco';
          }
        }

        if (roleType === ROLE_TYPES.nio) {
          if (req.form.validationErrors?.experience === 'required') {
            req.form.validationErrors.experience = 'requiredNio';
          }
        }

        if (roleType === ROLE_TYPES.sqp) {
          if (req.form.validationErrors?.experience === 'required') {
            req.form.validationErrors.experience = 'requiredSqp';
          }
        }

        if (roleType === ROLE_TYPES.nvs) {
          if (req.form.validationErrors?.experience === 'required') {
            req.form.validationErrors.experience = 'requiredNvs';
          }
        }

        next();
      },
      locals: (req, res, next) => {
        Object.assign(res.locals.static, {
          roleType: req.session.form[formId].values.type.toUpperCase()
        });
        next();
      }
    })
  );

  app.post('/', (req, res, next) => {
    return res.redirect(req.buildRoute('role.namedPersonMvp', { suffix: 'confirm' }));
  });

  return app;
};
