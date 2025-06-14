const { get, merge } = require('lodash');
const { page } = require('@asl/service/ui');
const form = require('../../../common/routers/form');
const { populateNamedPeople } = require('../../../common/middleware');
const { profileReplaced, PELH_OR_NPRC_ROLES } = require('../../helper');

const NAMED_PERSION_VERSION_ID = 2;

const sendData = (req, params = {}) => {
  const { type, rcvsNumber } =
    req.session.form[`${req.profileId}-new-role-named-person`].values;
  const { mandatory } =
    req.session.form[`${req.profileId}-mandatory-training`].values;
  const { incomplete, delayReason, completeDate } =
    req.session.form[`${req.profileId}-incomplete-training`].values;

  const replaceProfile = profileReplaced(req.establishment, type);
  const opts = {
    method: 'POST',
    json: merge(
      {
        data: {
          type,
          rcvsNumber,
          mandatory,
          incomplete,
          delayReason,
          completeDate,
          profileId: req.profileId,
          replaceProfile,
          replaceRoles: PELH_OR_NPRC_ROLES
        },
        meta: { version: NAMED_PERSION_VERSION_ID }
      },
      params
    )
  };

  return req.api(`/establishment/${req.establishmentId}/role`, opts);
};

module.exports = (settings) => {
  const app = page({
    root: __dirname,
    ...settings
  });

  app.use((req, res, next) => {
    req.model = {
      id: `${req.profile.id}-declaration`
    };
    next();
  });

  app.use(
    '/',
    form({
      requiresDeclaration: (req) => !req.user.profile.asruUser,
      locals: (req, res, next) => {
        Object.assign(res.locals.static, {
          values: {
            ...req.session.form[`${req.profile.id}-new-role-named-person`]
              .values
          }
        });
        next();
      },
      saveValues: (req, res, next) => {
        req.session.form[req.model.id].values = req.form.values;
        next();
      }
    })
  );

  app.post('/', populateNamedPeople, (req, res, next) => {
    sendData(req)
      .then((response) => {
        req.session.success = { taskId: get(response, 'json.data.id') };
        Object.keys(req.session.form).forEach((entry) => {
          delete req.session.form[entry];
        });
        return res.redirect(req.buildRoute('role.namedPersonMvp.success'));
      })
      .catch(next);
  });

  return app;
};
