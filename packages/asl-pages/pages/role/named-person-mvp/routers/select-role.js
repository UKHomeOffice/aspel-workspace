const { Router } = require('express');
const { omit } = require('lodash');
const { form } = require('../../../common/routers');
const { PELH_OR_NPRC_ROLES } = require('../../helper');

module.exports = ({ formId, getRoleSchema } = {}) => {
  const app = Router({ mergeParams: true });

  app.use(
    form({
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

        req.form.schema = getRoleSchema(
          rolesHeld.concat(rolesRequested),
          req.establishment
        );

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
        req.session.form[formId].values = { ...req.session.form[formId].values, ...req.form.values };
        next();
      }
    })
  );

  app.post('/', (req, res, next) => {
    return res.redirect(
      req.buildRoute('role.namedPersonMvp', { suffix: 'before-you-apply' })
    );
  });

  return app;
};
