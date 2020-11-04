const { Router } = require('express');
const shasum = require('shasum');
const isUUID = require('uuid-validate');
const { permissions, fetchOpenTasks } = require('../../middleware');
const { NotFoundError, BadRequestError } = require('../../errors');

const perms = task => permissions(task, req => ({ licenceHolderId: req.project.licenceHolderId }));

const router = Router({ mergeParams: true });

const normalise = (version) => {
  version.data = version.data || {};
  version.data.protocols = version.data.protocols || [];

  if (version.project.schemaVersion !== 0) {
    return version;
  }

  (version.data.conditions || []).forEach(condition => {
    if (condition.key === 'custom' && condition.edited) {
      condition.content = condition.edited;
      delete condition.edited;
    }
  });

  // some fields on species were migrated camelCase but the schema has hyphen-separated
  // if the data has _not_ been amended - i.e. no new value exists - then use the camelCase value
  (version.data.protocols || []).forEach(protocol => {
    (protocol.species || []).forEach(species => {
      if (species['genetically-altered'] === undefined) {
        species['genetically-altered'] = species.geneticallyAltered;
      }
      if (species['life-stages'] === undefined) {
        species['life-stages'] = species.lifeStage;
      }
      delete species.geneticallyAltered;
      delete species.lifeStage;
    });
    if (Array.isArray(protocol.steps)) {
      delete protocol.steps;
    }
  });
  return version;
};

const submit = action => (req, res, next) => {
  const params = {
    model: 'projectVersion',
    meta: req.body.meta,
    data: req.body.data
  };

  return Promise.resolve()
    .then(() => req.workflow.update({
      ...params,
      id: req.version.id,
      action: req.params.action || action
    }))
    .then(response => {
      res.response = response;
      next();
    })
    .catch(next);
};

router.param('versionId', (req, res, next, versionId) => {
  if (!isUUID(versionId)) {
    return next(new NotFoundError());
  }
  const { ProjectVersion } = req.models;
  const { withDeleted } = req.query;
  const queryType = withDeleted ? 'queryWithDeleted' : 'query';
  Promise.resolve()
    .then(() => ProjectVersion[queryType]()
      .findById(versionId)
      .eager('[project, project.licenceHolder]'))
    .then(version => {
      if (!version) {
        throw new NotFoundError();
      }
      // check that the version corresponds to the right parent project
      if (version.project.id !== req.project.id) {
        throw new NotFoundError();
      }

      req.version = version;
      req.version.project.granted = req.project.granted;
      req.version.project.draft = req.project.draft;
      req.version.project.versions = req.project.versions;
      next();
    })
    .catch(next);
});

const canUpdate = (req, res, next) => {
  if (req.version.id !== req.version.project.draft.id) {
    return next(new BadRequestError());
  }
  if (req.version.status !== 'draft') {
    return next(new BadRequestError());
  }
  return next();
};

const validateAction = (req, res, next) => {
  const allowed = ['update', 'patch'];

  if (allowed.includes(req.params.action)) {
    return next();
  }
  return next(new BadRequestError());
};

const userCanUpdateVersion = (req, res, next) => {
  if (req.version.asruVersion === req.user.profile.asruUser) {
    return next();
  }
  next(new BadRequestError());
};

router.get('/:versionId',
  perms('projectVersion.read'),
  (req, res, next) => {
    res.response = normalise(req.version);
    next();
  },
  fetchOpenTasks(req => req.version.projectId)
);

router.put('/:versionId/:action',
  perms('project.update'),
  validateAction,
  canUpdate,
  userCanUpdateVersion,
  submit(),
  (req, res, next) => {
    const { ProjectVersion } = req.models;
    ProjectVersion.query()
      .eager('[project, project.licenceHolder]')
      .findById(req.version.id)
      .then(version => {
        res.response = normalise(version);
        res.meta.checksum = shasum(res.response.data);
      })
      .then(() => next())
      .catch(e => next(e));
  }
);

router.post('/:versionId/submit',
  perms('project.update'),
  userCanUpdateVersion,
  submit('submit')
);

router.post('/:versionId/withdraw',
  perms('project.update'),
  userCanUpdateVersion,
  submit('withdraw')
);

module.exports = router;
