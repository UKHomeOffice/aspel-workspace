const { Router } = require('express');
const { BadRequestError, NotFoundError } = require('@asl/service/errors');
const isUUID = require('uuid-validate');

const permissions = require('@asl/service/lib/middleware/permissions');
const whitelist = require('../middleware/whitelist');

const canUpdate = (req, res, next) => {
  if (req.version.data.isLegacyStub) {
    return next();
  }

  if (req.version.status !== 'submitted') {
    return next(new BadRequestError());
  }
  return next();
};

const update = () => (req, res, next) => {
  const params = {
    model: 'projectVersion',
    meta: req.body.meta,
    data: req.body.data,
    action: 'updateConditions',
    id: req.version.id
  };

  req.workflow.update(params)
    .then(response => {
      res.response = response;
      next();
    })
    .catch(next);
};

const replaceHba = async (req, res, next) => {
  try {
    const { token, filename, attachmentId, hbaReplacementReason,
      declaration, projectId, projectVersionId, uploadedAt } = req.body.data || {};
    if (!token || !filename) {
      throw new BadRequestError('token and filename are required');
    }

    const params = {
      model: 'projectVersion',
      id: projectId,
      data: {
        replaceHba: true,
        token,
        filename,
        attachmentId,
        uploadedAt,
        hbaReplacementReason,
        declaration,
        projectVersionId,
        projectId,
        asruUser: req.user.profile.firstName + ' ' + req.user.profile.lastName,
        establishmentId: req.version.project.establishmentId
      },
      meta: {
        changedBy: req.user.profile.id,
        ...req.body.meta
      },
      action: 'replaceHba'
    };

    // Call the workflow update
    const result = await req.workflow.update(params);

    // Respond with workflow result
    res.response = result.json.data || result;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = () => {
  const router = Router();

  router.param('id', (req, res, next, id) => {
    if (!isUUID(id)) {
      return next(new NotFoundError());
    }
    const { ProjectVersion } = req.models;
    Promise.resolve()
      .then(() => ProjectVersion.get(req.params.id))
      .then(version => {
        if (!version) {
          throw new NotFoundError();
        }
        req.version = version;
        next();
      })
      .catch(next);
  });

  router.put('/:id/conditions',
    permissions('project.updateConditions'),
    whitelist('conditions', 'protocolId', 'retrospectiveAssessment'),
    canUpdate,
    update()
  );

  router.put('/:id/replace-hba',
    permissions('project.replaceHBA'),
    whitelist('token', 'filename', 'attachmentId', 'hbaReplacementReason',
      'declaration', 'projectVersionId', 'projectId', 'establishmentId', 'asruUser', 'uploadedAt'),
    replaceHba
  );

  return router;
};
