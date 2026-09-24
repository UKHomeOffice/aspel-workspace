const dayJs = require('@ukhomeoffice/asl-components/dayjs');
const { STRICT_DATE_FORMATS, formatIsoDate, parseDate } = dayJs;
const { page } = require('@asl/service/ui');
const { form } = require('../../common/routers');
const schema = require('./schema');

module.exports = () => {
  const app = page({ root: __dirname });

  app.use(form({
    schema,
    process: (req, res, next) => {
      const day = req.body['passDate-day'];
      const month = req.body['passDate-month'];
      const year = req.body['passDate-year'];

      Object.assign(req.form.values, {
        passDate: `${year}-${month}-${day}`
      });
      next();
    },
    saveValues: (req, res, next) => {
      req.session.form[req.model.id].values.passDate = formatIsoDate(parseDate(req.form.values.passDate, STRICT_DATE_FORMATS, true));
      next();
    }
  }));

  app.post('/', (req, res, next) => {
    res.redirect(req.buildRoute(`${res.locals.static.basePage}.modules`));
  });

  return app;
};
