const { Router } = require('express');
const isUUID = require('uuid-validate');
const { permissions } = require('../../middleware');
const { NotFoundError, BadRequestError } = require('../../errors');

const perms = task => permissions(task, req => ({ licenceHolderId: req.project.licenceHolderId }));

const router = Router({ mergeParams: true });

const submit = action => (req, res, next) => {
  const params = {
    model: 'projectVersion',
    meta: req.body.meta,
    data: req.body.data
  };

  return Promise.resolve()
    .then(() => {
      switch (action) {
        case 'delete':
          if (!['draft', 'withdrawn'].includes(req.version.status)) {
            throw new BadRequestError('Granted or submitted project amendments cannot be deleted.');
          }

          return req.workflow.delete({
            ...params,
            id: req.version.id
          });
        default:
          return req.workflow.update({
            ...params,
            id: req.version.id,
            action: req.params.action || action
          });
      }
    })
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
    res.response = req.version;
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

router.delete('/:id',
  perms('project.update'),
  submit('delete')
);

module.exports = router;
