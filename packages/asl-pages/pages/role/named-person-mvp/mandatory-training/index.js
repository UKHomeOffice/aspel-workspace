const { get, merge } = require('lodash');
const { page } = require('@asl/service/ui');
const { form } = require('../../../common/routers');
const { buildModel } = require('../../../../lib/utils');
const schema = require('./schema');
const confirm = require('../routers/confirm');
const success = require('../routers/success');
const { profileReplaced, PELH_OR_NPRC_ROLES } = require('../../helper');
const { populateNamedPeople } = require('../../../common/middleware');

const sendData = (req, params = {}) => {
  const { type, rcvsNumber, comment } = req.session.form[req.model.id].values;

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
    ...settings,
    paths: ['/confirm']
  });

  app.use((req, res, next) => {
    req.model = {
      id: `${req.profile.id}-new-role-named-person`,
      ...buildModel(schema)
    };
    next();
  });

  app.use(
    form({
      configure(req, res, next) {
        req.form.schema = schema(req.session.form[req.model.id].values);
        next();
      },
      locals: (req, res, next) => {
        Object.assign(res.locals, { model: req.model });
        Object.assign(res.locals.static, {
          profile: req.profile,
          role: {
            ...req.session.form[req.model.id].values
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

  // eslint-disable-next-line no-warning-comments
  //TODO: redirects is not part of current ticket
  app.post('/', (req, res, next) => {
    const { values } = req.form;
    if (values) {
      return res.redirect(
        req.buildRoute('role.namedPersonMvp', { suffix: 'confirm' })
      );
    } else {
      return res.redirect(req.buildRoute('training.dashboard'));
    }
  });

  // app.use(
  //   '/confirm',
  //   populateNamedPeople,
  //   confirm({
  //     action: 'create',
  //     sendData
  //   })
  // );

  // app.post('/confirm', populateNamedPeople, (req, res, next) => {
  //   sendData(req)
  //     .then((response) => {
  //       req.session.success = { taskId: get(response, 'json.data.id') };
  //       delete req.session.form[req.model.id];
  //       return res.redirect(
  //         req.buildRoute('role.create', { suffix: 'success' })
  //       );
  //     })
  //     .catch(next);
  // });

  app.use('/success', success());

  return app;
};
