const { page } = require('@asl/service/ui');
const selectLicence = require('./routers/select-licence');
const { form } = require('../../../common/routers');
const schema = require('./schema');
const { pickBy } = require('lodash');
const { buildModel } = require('../../../../lib/utils');

const FORM_ID = 'new-category-e-course';

module.exports = settings => {
  const app = page({
    ...settings,
    root: __dirname,
    index: false,
    paths: [
      '/select-licence'
      //   '/course-details',
      //   '/confirm'
    ]
  });

  app.get('/', (req, res) => {
    // A user being linked to the index is starting a new form, clear out session data and redirect to the first page.
    if (req.session.form?.[FORM_ID]) {
      delete req.session.form[FORM_ID];
    }
    return res.redirect(req.buildRoute('categoryE.course.add', {suffix: 'select-licence'}));
  });

  app.use((req, res, next) => {
    res.locals.pageTitle = `${res.locals.static.content.pageTitle} - ${res.locals.static.content.breadcrumbs.categoryE.course.add}`;
    next();
  });

  app.use((req, res, next) => {
    req.model = {
      id: FORM_ID,
      ...buildModel(schema)
    };
    next();
  });

  app.use('/:page', form({
    schema,
    configure(req, res, next) {
      req.form.schema = pickBy(schema, ({page}) => page === req.page);
      return next();
    }
  }));

  app.use('/select-licence', selectLicence());

  return app;
};
