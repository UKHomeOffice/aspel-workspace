const { form } = require('../../../common/routers');
const { Router } = require('express');
const schema = require('../schema').incompleteTraining;
const { isValid } = require('date-fns');
const { formatDate, DATE_FORMAT } = require('@ukhomeoffice/asl-components/src/utils');

module.exports = ({ formId }) => {
  const app = Router({ mergeParams: true });

  app.use(
    form({
      configure(req, res, next) {
        const roleType = req.session.form[formId].values.type;
        req.form.schema = schema(roleType);
        next();
      },
      process: (req, res, next) => {
        const day = req.body['completeDate-day'];
        const month = req.body['completeDate-month'];
        const year = req.body['completeDate-year'];

        const completeDate = formatDate(`${year}-${month}-${day}`, DATE_FORMAT.medium);
        req.form.values.completeDate = isValid(completeDate) ? completeDate : '';
        next();
      },
      locals: (req, res, next) => {
        Object.assign(res.locals.static, {
          roleType: req.session.form[formId].values.type.toUpperCase()
        });
        next();
      },
      saveValues: (req, res, next) => {
        req.session.form[formId].values = req.form.values;
        next();
      }
    })
  );

  app.post('/', (req, res, next) => {
    return res.redirect(req.buildRoute('role.namedPersonMvp.confirm'));
  });

  return app;
};
