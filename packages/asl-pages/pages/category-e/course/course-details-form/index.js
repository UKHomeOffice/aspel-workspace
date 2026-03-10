const { page } = require('@asl/service/ui');
const selectLicence = require('./routers/select-licence');
const courseDetails = require('./routers/course-details');
const confirm = require('./routers/confirm');
const { form } = require('../../../common/routers');
const schema = require('./schema');
const { pickBy } = require('lodash');
const { formatDate, ucFirst } = require('../../formatters');
const { modelFromCourse } = require('../middleware/model-from-course');

const getFormId = ({ trainingCourseId }) => trainingCourseId ?? 'new-category-e-course';

module.exports = ({ baseRoute = 'categoryE.course.add' }) => settings => {
  const app = page({
    ...settings,
    root: __dirname,
    index: false,
    paths: [
      '/select-licence',
      '/course-details',
      '/confirm'
    ]
  });

  app.get('/', (req, res) => {
    const formId = getFormId(req);

    // A user being linked to the index is starting a new form, clear out session data and redirect to the first page.
    if (req.session.form?.[formId]) {
      delete req.session.form[formId];
    }
    if (req.trainingCourse) {
      return res.redirect(
        req.buildRoute(
          baseRoute,
          { suffix: 'course-details', trainingCourseId: req.trainingCourseId }
        )
      );
    } else {
      return res.redirect(req.buildRoute(baseRoute, { suffix: 'select-licence' }));
    }
  });

  app.use((req, res, next) => {
    const mode = req.trainingCourseId ? 'update' : 'add';

    res.locals.pageTitle = [
      res.locals.static.content.pageTitle[mode] ?? res.locals.static.content.pageTitle,
      res.locals.static.content.breadcrumbs.categoryE.course[mode]
    ].join(' - ');

    next();
  });

  app.use(modelFromCourse(schema));

  const buildFetchProjectMiddleware = (onProject) => (req, res, next) => {
    const projectId = req.form.values?.projectId ??
      req.session.form?.[getFormId(req)]?.values?.projectId ??
      res.locals.model?.projectId;
    if (!projectId) {
      return next();
    }
    req.api(`/establishment/${req.establishmentId}/projects/${projectId}`)
      .then(response => response.json.data)
      .then(project => {
        project.formattedExpiryDate = formatDate(project.expiryDate);

        onProject(project, req, res);
        next();
      })
      .catch(next);
  };

  function setSchemaSpeciesOptions(project, req, res) {
    const speciesOptions = (project.species ?? []).map(species => ({
      value: species,
      label: ucFirst(species)
    }));

    if (req.form.schema.species) {
      req.form.schema.species.options = speciesOptions;
    }

    if (res.locals.static.schema?.species) {
      res.locals.static.schema.species.options = speciesOptions;
    }
  }

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
      req.form.schema = pickBy(schema, ({page}) => page === req.page);
      return next();
    },
    locals: buildFetchProjectMiddleware((project, req, res) => {
      res.locals.static.project = project;
      setSchemaSpeciesOptions(project, req, res);
    }),
    process: buildFetchProjectMiddleware((project, req, res) => {
      // Model is passed to validators, this is needed to validate against the
      // project expiry date.
      req.model.project = project;
      setSchemaSpeciesOptions(project, req, res);

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

      const projectSpecies = project.species ?? [];
      if (Array.isArray(req.form.values.species)) {
        req.form.values.species = req.form.values.species.filter(species => projectSpecies.includes(species));
      }
    })
  }));

  app.use('/select-licence', selectLicence({baseRoute}));
  app.use('/course-details', courseDetails({baseRoute}));
  app.use('/confirm', confirm({baseRoute}));

  return app;
};
