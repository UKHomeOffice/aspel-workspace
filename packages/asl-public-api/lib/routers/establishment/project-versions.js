const { Router } = require('express');
const isUUID = require('uuid-validate');
const { permissions } = require('../../middleware');
const { NotFoundError, BadRequestError } = require('../../errors');

const perms = task => permissions(task, req => ({ licenceHolderId: req.project.licenceHolderId }));

const router = Router({ mergeParams: true });

const normalise = (version) => {
  if (version.project.schemaVersion !== 0) {
    return version;
  }
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

router.param('id', (req, res, next, id) => {
  if (!isUUID(id)) {
    return next(new NotFoundError());
  }
  const { ProjectVersion } = req.models;
  const { withDeleted } = req.query;
  const queryType = withDeleted ? 'queryWithDeleted' : 'query';
  Promise.resolve()
    .then(() => ProjectVersion[queryType]()
      .findById(req.params.id)
      .eager('project'))
    .then(version => {
      if (!version) {
        throw new NotFoundError();
      }
      // check that the version corresponds to the right parent project
      if (version.project.id !== req.project.id) {
        throw new NotFoundError();
      }
      req.version = version;
      next();
    })
    .catch(next);
});

const canUpdate = (req, res, next) => {
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

router.get('/:id',
  perms('project.read.single'),
  (req, res, next) => {
    res.response = normalise(req.version);
    next();
  }
);

router.put('/:id/:action',
  perms('project.update'),
  validateAction,
  canUpdate,
  submit()
);

router.post('/:id/submit',
  perms('project.update'),
  submit('submit')
);

router.post('/:id/withdraw',
  perms('project.update'),
  submit('withdraw')
);

module.exports = router;
