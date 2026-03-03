const { page } = require('@asl/service/ui');
const { FEATURE_FLAG_NAMED_PERSON_MVP } = require('@asl/service/ui/feature-flag');
const router = require('./routers');
const schema = require('./schema');
const { form } = require('../../common/routers');
const { buildModel } = require('../../../lib/utils');
const { omit } = require('lodash');

const FORM_ID = 'new-role-named-person';

const paths = {
  beforeYouApply: '/before-you-apply',
  selectRole: '/select-role',
  mandatoryTraining: '/mandatory-training',
  incompleteTraining: '/incomplete-training',
  confirm: '/confirm',
  success: '/success'
};

module.exports = (settings) => {
  const app = page({
    ...settings,
    root: __dirname,
    index: false,
    paths: [
      paths.beforeYouApply,
      paths.selectRole
    ]
  });

  app.get('/', (req, res) => {
    if (!req.hasFeatureFlag(FEATURE_FLAG_NAMED_PERSON_MVP)) {
      return res.redirect(req.buildRoute('role.create'));
    }

    if (req.session.form?.[FORM_ID]) {
      delete req.session.form[FORM_ID];
    }
    return res.redirect(req.buildRoute('role.namedPersonMvp', { suffix: 'select-role' }));
  });

  app.use((req, res, next) => {
    req.model = {
      id: FORM_ID,
      ...buildModel(schema)
    };
    next();
  });

  app.use('/:page', form({
    configure: (req, res, next) => {
      const rolesHeld = req.profile.roles
        .filter((role) => role.establishmentId === req.establishmentId)
        .map((role) => role.type);

      const addRoleTasks = res.locals.static.addRoleTasks || [];
      const rolesRequested = addRoleTasks
        .map((task) => task.type);

      req.form.schema = {
        ...schema.selectRole(rolesHeld.concat(rolesRequested), req.establishment),
        rcvsNumber: {}
      };

      req.model.openTasks = []; // hide the open tasks warning on role forms as it is not applicable

      next();
    },
    getValues: (req, res, next) => {
      req.form.values.rcvsNumber =
        req.form.values.rcvsNumber || req.profile.rcvsNumber;
      next();
    },
    locals: (req, res, next) => {
      res.locals.static.schema = omit(req.form.schema, 'rcvsNumber');
      res.locals.static.ownProfile = req.user.profile.id === req.profileId;
      res.locals.pageTitle = `${res.locals.static.content.title} - ${req.establishment.name}`;
      next();
    },
    saveValues: (req, res, next) => {
      req.session.form[FORM_ID].values = req.form.values;
      next();
    }
  }));

  app.post(paths.selectRole, (req, res) => {
    return res.redirect(
      req.buildRoute('role.namedPersonMvp', { suffix: 'before-you-apply' })
    );
  });

  app.use(paths.selectRole, router.selectRole());
  app.use(paths.beforeYouApply, router.beforeYouApply());
  // app.use(paths.mandatoryTraining, router.mandatoryTraining());
  // app.use(paths.incompleteTraining, router.incompleteTraining());
  // app.use(paths.confirm, router.confirm());
  // app.use(paths.success, router.success());

  return app;
};

// module.exports.routes = routes;
