const { Router } = require('express');
const { get, merge, pick } = require('lodash');
const form = require('../../../common/routers/form');
const { populateNamedPeople } = require('../../../common/middleware');
const { profileReplaced, PELH_OR_NPRC_ROLES } = require('../../helper');
const { versions } = require('@ukhomeoffice/asl-constants');
const ROLE_TYPES_WITH_DECLARATION = ['nacwo', 'nio', 'ntco', 'nvs', 'sqp'];
const SKILLS_AND_EXPERIENCE_FIELDS = ['experience', 'skills', 'authority', 'understanding', 'familiarity', 'communication'];

const getIncompleteTrainingDetails = (req, formId) => {
  const formData = get(req.session.form, [formId, 'values'], {});
  const { incomplete, delayReason, completeDate } = formData;
  return { incomplete, delayReason, completeDate };
};

const getMandatoryTraining = (req, formId) => {
  const { mandatory } = get(req.session.form, [formId, 'values'], {});

  return mandatory;
};

const sendData = (req, formId, params = {}) => {
  const values = req.session.form[formId]?.values || {};
  const { type, rcvsNumber } = values;
  const mandatory = getMandatoryTraining(req, formId);
  const { incomplete, delayReason, completeDate } =
    getIncompleteTrainingDetails(req, formId);
  const skillsAndExperience = pick(values, SKILLS_AND_EXPERIENCE_FIELDS);

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
          ...skillsAndExperience,
          profileId: req.profileId,
          replaceProfile,
          replaceRoles: PELH_OR_NPRC_ROLES
        },
        meta: { version: versions.role.NAMED_PERSON_VERSION_ID }
      },
      params
    )
  };

  return req.api(`/establishment/${req.establishmentId}/role`, opts);
};

module.exports = ({ formId }) => {
  const app = Router({ mergeParams: true });

  app.use(
    form({
      requiresDeclaration: (req) => {
        const roleType = req.session.form[formId]?.values?.type;
        return !req.user.profile.asruUser && ROLE_TYPES_WITH_DECLARATION.includes(roleType);
      },
      locals: (req, res, next) => {
        Object.assign(res.locals.static, {
          values: {
            ...req.session.form[formId].values
          },
          incompleteTraining: getIncompleteTrainingDetails(req, formId),
          mandatoryTraining: getMandatoryTraining(req, formId)
        });
        next();
      }
    })
  );

  app.get('/', (req, res) => res.sendResponse());

  app.post('/', populateNamedPeople, (req, res, next) => {
    sendData(req, formId)
      .then((response) => {
        req.session.success = { taskId: get(response, 'json.data.id') };
        delete req.session.form[formId];
        return res.redirect(
          req.buildRoute('role.namedPersonMvp', { suffix: 'success' })
        );
      })
      .catch(next);
  });

  return app;
};
