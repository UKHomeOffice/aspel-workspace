const { page } = require('@asl/service/ui');
const { form } = require('../../../common/routers');
const { buildModel } = require('../../../../lib/utils');
const confirm = require('./routers/confirm');
const details = require('./routers/details');
const endorse = require('./routers/endorse');
const schema = require('./schema');
const { omit } = require('lodash');

function getSchemaForCoursePurpose (schema, trainingCourse) {
  if (trainingCourse.coursePurpose === 'higherEducation') {
    return omit(schema, ['jobTitleOrQualification', 'fieldOfExpertise', 'applicantTrainingUseAtWork']);
  } else if (trainingCourse.coursePurpose === 'training') {
    return omit(schema, ['qualificationLevelAndSubject', 'applicantLearningUse']);
  } else {
    throw new Error(`Invalid course purpose: ${trainingCourse.coursePurpose}`);
  }
}

const FORM_ID = 'new-course-participant';

module.exports = () => {
  const app = page({
    root: __dirname,
    index: false,
    paths: [
      '/details',
      '/confirm',
      '/endorse'
    ]
  });

  app.get('/', (req, res) => {
    // A user being linked to the index is starting a new form, clear out session data and redirect to the first page.
    if (req.session.form?.[FORM_ID]) {
      delete req.session.form[FORM_ID];
    }

    return res.redirect(req.buildRoute('categoryE.course.addParticipant', {suffix: 'details'}));
  });

  app.use((req, res, next) => {
    res.locals.pageTitle = [
      res.locals.static.content.title,
      res.locals.static.content.breadcrumbs.categoryE.course.addParticipant,
      res.locals.static.trainingCourse.title
    ].join(' - ');
    next();
  });

  app.use((req, res, next) => {
    res.locals.static.course = req.trainingCourse;
    res.locals.static.modelSchema = getSchemaForCoursePurpose(schema, req.trainingCourse);
    req.model = {
      id: FORM_ID,
      ...buildModel(res.locals.schema)
    };
    next();
  });

  app.use('/:page', form({
    configure: (req, res, next) => {
      switch (req.page) {
        case 'details':
          req.form.schema = res.locals.static.modelSchema;
          break;
        case 'confirm':
          req.form.schema = {};
          break;
        case 'endorse':
          req.form.schema = {
            comments: {
              inputType: 'textarea'
            }
          };
          break;
        default:
          return next(new Error(`Unknown page: ${req.page}`));
      }

      next();
    },
    process: (req, res, next) => {
      if (req.form.schema['dob']) {
        const day = req.body['dob-day'];
        const month = req.body['dob-month'];
        const year = req.body['dob-year'];

        Object.assign(req.form.values, {
          dob: `${year}-${month}-${day}`
        });
      }

      next();
    }
  }));

  app.use('/details', details());
  app.use('/confirm', confirm());
  app.use('/endorse', endorse());

  app.get('/', (req, res) => res.sendResponse());

  return app;
};
