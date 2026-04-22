const { page } = require('@asl/service/ui');
const { FEATURE_FLAG_NAMED_PERSON_MVP } = require('@asl/service/ui/feature-flag');
const router = require('./routers');
const schema = require('./schema');
const { clearSessionIfNotFromTask } = require('../../common/middleware');
const { buildModel } = require('../../../lib/utils');
const { PELH_OR_NPRC_ROLES } = require('../helper');
const FORM_ID = 'new-role-named-person';

const getRoleSchema = (roles = [], establishment) => ({
  ...schema.selectRole(roles, establishment),
  rcvsNumber: {}
});

const paths = {
  beforeYouApply: '/before-you-apply',
  selectRole: '/select-role',
  mandatoryTraining: '/mandatory-training',
  incompleteTraining: '/incomplete-training',
  skillsAndExperience: '/skills-and-experience',
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
      paths.selectRole,
      paths.mandatoryTraining,
      paths.incompleteTraining,
      paths.skillsAndExperience
      // paths.confirm,
      // paths.success
    ]
  });

  app.get('/', clearSessionIfNotFromTask());

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
      ...buildModel(getRoleSchema([], req.establishment))
    };
    next();
  });

  app.use('/', (req, res, next) => {
    const query = {
      model: 'establishment',
      modelId: req.establishmentId,
      onlyOpen: true,
      action: 'replace'
    };
    req
      .api('/tasks/related', { query })
      .then((response) => {
        return response.json.data || [];
      })
      .then((data) => {
        res.locals.static = res.locals.static || {};
        res.locals.static.pelhOrNprcTasks = data
          .filter((task) => PELH_OR_NPRC_ROLES.includes(task.data.data.type))
          .map((task) => ({
            id: task.id,
            type: task.data.data.type
          }));
        next();
      })
      .catch(next);
  });

  app.use(paths.selectRole, router.selectRole({ formId: FORM_ID, getRoleSchema }));
  app.use(paths.beforeYouApply, router.beforeYouApply());
  app.use(paths.mandatoryTraining, router.mandatoryTraining({ formId: FORM_ID }));
  app.use(paths.incompleteTraining, router.incompleteTraining({ formId: FORM_ID }));
  app.use(paths.skillsAndExperience, router.skillsAndExperience({ formId: FORM_ID }));
  // app.use(paths.confirm, router.confirm());
  // app.use(paths.success, router.success());

  return app;
};

// module.exports.routes = routes;
