const { Router } = require('express');
const { fetchOpenTasks, permissions, whitelist } = require('../../middleware');

const router = Router({ mergeParams: true });

const submit = (action) => {

  return (req, res, next) => {
    const params = {
      model: 'role',
      data: {
        ...req.body.data,
        profileId: req.body.data.profileId,
        establishmentId: req.establishment.id
      },
      meta: req.body.meta,
      id: req.params.id
    };

    return Promise.resolve()
      .then(() => {
        switch (action) {
          case 'create':
            return req.workflow.create(params);
          case 'delete':
            return req.workflow.delete(params);
        }
      })
      .then(response => {
        res.response = response;
        next();
      })
      .catch(next);
  };
};

router.get('/', (req, res, next) => {
  const { Role } = req.models;
  const { type } = req.query;
  Promise.resolve()
    .then(() => {
      return Role.query()
        .skipUndefined()
        .where({
          type,
          establishmentId: req.establishment.id
        })
        .eager('[profile, places]');
    })
    .then(result => {
      res.response = result;
      next();
    })
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  const { Role } = req.models;
  const { withDeleted } = req.query;
  const queryType = withDeleted ? 'queryWithDeleted' : 'query';
  Promise.resolve()
    .then(() => {
      return Role[queryType]()
        .findById(req.params.id)
        .where('establishmentId', req.establishment.id)
        .eager('[profile, places]');
    })
    .then(role => {
      res.response = role;
      next();
    })
    .catch(next);
}, fetchOpenTasks);

router.post('/',
  permissions('profile.roles'),
  whitelist('profileId', 'type', 'comment', 'rcvsNumber'),
  submit('create')
);

router.delete('/:id',
  permissions('profile.roles'),
  whitelist('profileId', 'comment'),
  submit('delete')
);

module.exports = router;
