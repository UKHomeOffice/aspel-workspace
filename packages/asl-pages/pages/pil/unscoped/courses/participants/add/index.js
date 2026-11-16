const dayJs = require('@ukhomeoffice/asl-components/dayjs');
const { STRICT_DATE_FORMATS, formatIsoDate, parseDate } = dayJs;
const { page } = require('@asl/service/ui');
const { form } = require('../../../../../common/routers');
const { buildModel } = require('../../../../../../lib/utils');
const confirm = require('./routers/confirm');
const participantDetailsSchemaHelper = require('./helpers/participant-details-schema-helper');
const schema = require('./schema');

module.exports = () => {
  const app = page({
    root: __dirname,
    paths: ['/confirm']
  });

  let modifiedSchema;

  app.use((req, res, next) => {
    res.locals.static.course = req.trainingCourse;

    modifiedSchema = participantDetailsSchemaHelper(schema, req.trainingCourse);
    req.model = {
      id: 'new-participant',
      ...buildModel(modifiedSchema)
    };
    next();
  });

  app.use(form({
    configure: (req, res, next) => {
      req.form.schema = modifiedSchema;
      next();
    },
    process: (req, res, next) => {
      const day = req.body['dob-day'];
      const month = req.body['dob-month'];
      const year = req.body['dob-year'];

      Object.assign(req.form.values, {
        dob: `${year}-${month}-${day}`
      });

      next();
    },
    saveValues: (req, res, next) => {
      req.session.form[req.model.id].values.dob = formatIsoDate(parseDate(req.form.values.dob, STRICT_DATE_FORMATS, true));
      next();
    }
  }));

  app.post('/', (req, res) => {
    res.redirect(`${req.buildRoute('pils.courses.participants.add')}/confirm`);
  });

  app.use('/confirm', confirm());

  return app;
};
