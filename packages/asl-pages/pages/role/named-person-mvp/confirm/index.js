const { get, merge } = require('lodash');
const { page } = require('@asl/service/ui');
const form = require('../../../common/routers/form');
const { populateNamedPeople } = require('../../../common/middleware');
const { profileReplaced, PELH_OR_NPRC_ROLES } = require('../../helper');

const sendData = (req, params = {}) => {
  // eslint-disable-next-line no-warning-comments
  //TODO: get nvs number and comment when working on nvs journey
  const { type, rcvsNumber, comment } =
    req.session.form[`${req.profileId}-new-role-named-person`].values;

  const replaceProfile = profileReplaced(req.establishment, type);
  const opts = {
    method: 'POST',
    json: merge(
      {
        data: {
          type,
          rcvsNumber,
          profileId: req.profileId,
          replaceProfile,
          replaceRoles: PELH_OR_NPRC_ROLES
        },
        meta: { comment }
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
    populateNamedPeople,
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
