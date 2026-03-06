const { page } = require('@asl/service/ui');
const { FEATURE_FLAG_NAMED_PERSON_MVP } = require('@asl/service/ui/feature-flag');
const router = require('./routers');
const schema = require('./schema');
const { form } = require('../../common/routers');
const { buildModel } = require('../../../lib/utils');
const { omit } = require('lodash');
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

  app.use('/:page', form({
    configure: (req, res, next) => {
      const rolesHeld = req.profile.roles
        .filter((role) => role.establishmentId === req.establishmentId)
        .map((role) => role.type);

      const addRoleTasks = req.profile.openTasks
        .filter(
          (task) =>
            task.data.model === 'role' && task.data.action === 'create'
        )
        .map((task) => ({
          id: task.id,
          type: task.data.data.type
        }));

      const pelOrNprcTasks = res.locals.static.pelhOrNprcTasks || [];
      const rolesRequested = addRoleTasks
        .map((task) => task.type)
        .concat(pelOrNprcTasks.length > 0 ? PELH_OR_NPRC_ROLES : []);

      req.form.schema = getRoleSchema(rolesHeld.concat(rolesRequested), req.establishment);

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

  app.use(paths.selectRole, router.selectRole());
  app.use(paths.beforeYouApply, router.beforeYouApply());
  // app.use(paths.mandatoryTraining, router.mandatoryTraining());
  // app.use(paths.incompleteTraining, router.incompleteTraining());
  // app.use(paths.confirm, router.confirm());
  // app.use(paths.success, router.success());

  return app;
};

// module.exports.routes = routes;
