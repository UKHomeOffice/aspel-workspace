const { page } = require('@asl/service/ui');
const schema = require('./schema');
const { form } = require('../../../common/routers');
const changeDates = require('./routers/change-dates');
const confirm = require('./routers/confirm');
const { modelFromCourse } = require('../middleware/model-from-course');

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname,
    index: false,
    paths: [
      '/change-dates',
      '/confirm'
    ]
  });

  app.get('/', (req, res) => {
    // A user being linked to the index is starting a new form, clear out session data and redirect to the first page.
    if (req.session.form?.[req.trainingCourseId]) {
      delete req.session.form[req.trainingCourseId];
    }

    return res.redirect(req.buildRoute(
      'categoryE.course.reschedule',
      { suffix: 'change-dates', trainingCourseId: req.trainingCourseId }
    ));
  });

  app.use((req, res, next) => {
    res.locals.pageTitle = [
      res.locals.static.content.pageTitle,
      res.locals.static.content.breadcrumbs.categoryE.course.reschedule
    ].join(' - ');

    next();
  });

  app.use(modelFromCourse(schema));

  const parseAndSetDate = (req, key) => {
    const day = req.body[`${key}-day`];
    const month = req.body[`${key}-month`];
    const year = req.body[`${key}-year`];

    Object.assign(req.form.values, {
      [key]: `${year}-${month}-${day}`
    });
  };

  app.use('/:page', form({
    schema,
    configure(req, res, next) {
      req.form.schema = req.page === 'change-dates' ? schema : {};
      return next();
    },
    process: (req, res, next) => {
      if (req.form.values.courseDuration === 'one-day') {
        parseAndSetDate(req, 'courseDate');
        req.form.values.startDate = null;
        req.form.values.endDate = null;
      }

      if (req.form.values.courseDuration === 'multi-day') {
        parseAndSetDate(req, 'startDate');
        parseAndSetDate(req, 'endDate');
        req.form.values.courseDate = null;
      }

      return next();
    }
  }));

  app.use('/change-dates', changeDates());
  app.use('/confirm', confirm());

  return app;
};
