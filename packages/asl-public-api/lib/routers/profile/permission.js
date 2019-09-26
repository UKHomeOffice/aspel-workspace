const { Router } = require('express');
const { BadRequestError } = require('../../errors');
const { permissions, whitelist } = require('../../middleware');

const submit = (action) => {

  return (req, res, next) => {
    const params = {
      model: 'permission',
      data: {
        ...req.body.data,
        profileId: req.profileId,
        establishmentId: req.establishment.id
      },
      id: null
    };

    return Promise.resolve()
      .then(() => {
        switch (action) {
          case 'update':
            return req.workflow.update(params);
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

const notSelf = () => (req, res, next) => {
  if (req.profileId === req.user.profile.id) {
    throw new BadRequestError();
  }
  next();
};

const removable = () => (req, res, next) => {
  const { Profile } = req.models;
  const params = {
    id: req.profileId,
    userId: req.user.profile.id,
    establishmentId: req.establishmentId
  };
  Profile.scopeSingle(params).get()
    .then(profile => {
      const hasProjects = profile.projects.filter(project => project.status === 'active').length;
      const hasRoles = profile.roles && profile.roles.length;
      const hasPil = profile.pil && profile.pil.status === 'active' && profile.pil.establishmentId === req.establishmentId;

      if (hasProjects || hasRoles || hasPil) {
        throw new BadRequestError();
      }
    })
    .then(() => next())
    .catch(next);
};

const router = Router({ mergeParams: true });

router.put('/',
  permissions('profile.permissions'),
  notSelf(),
  whitelist('role'),
  submit('update')
);

router.delete('/',
  permissions('profile.permissions'),
  notSelf(),
  removable(),
  whitelist(),
  submit('delete')
);

module.exports = router;
