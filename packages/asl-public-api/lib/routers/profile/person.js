const { Router } = require('express');
const isUUID = require('uuid-validate');
const { get } = require('lodash');
const { fetchOpenTasks, permissions, whitelist, validateSchema, updateDataAndStatus } = require('../../middleware');
const { NotFoundError, BadRequestError } = require('../../errors');

const update = () => (req, res, next) => {
  const params = {
    model: 'profile',
    id: req.profileId,
    data: req.body.data,
    meta: req.body.meta
  };

  req.workflow.update(params)
    .then(response => {
      res.response = response.json.data;
      next();
    })
    .catch(next);
};

const validate = () => {
  return (req, res, next) => {
    return validateSchema(req.models.Profile, {
      ...(req.user.profile || {}),
      ...req.body.data
    })(req, res, next);
  };
};

const validateEmail = () => {
  return (req, res, next) => {
    const email = get(req, 'body.data.email');

    if (!email) {
      throw new BadRequestError('An email address must be provided');
    }

    const { Profile } = req.models;
    return Profile.query().where({ email })
      .then(profiles => {
        if (profiles.length > 0) {
          throw new BadRequestError('Email address is already in use');
        }
      })
      .then(() => next())
      .catch(err => next(err));
  };
};

const getSingleProfile = req => {
  if (!isUUID(req.profileId)) {
    throw new NotFoundError();
  }
  const { Profile } = req.models;
  const profile = Profile.scopeSingle({
    id: req.profileId,
    userId: req.user.profile.id,
    establishmentId: (req.establishment && req.establishment.id) || undefined
  });

  // own profile
  if (req.profileId === req.user.profile.id) {
    return profile.get();
  }

  return Promise.resolve()
    .then(() => req.user.can('profile.read.all', req.params))
    .then(allowed => {
      if (allowed) {
        return profile.get();
      }
      return Promise.resolve()
        .then(() => req.user.can('profile.read.basic', req.params))
        .then(allowed => {
          if (allowed) {
            return profile.getNamed();
          }
          throw new NotFoundError();
        });
    })
    .then(profile => {
      if (!profile) {
        throw new NotFoundError();
      }
      return profile;
    })
    .then(profile => {
      if (req.establishment) {
        profile.establishments = profile.establishments.filter(e => e.id === req.establishment.id);
      }
      return profile;
    })
    .then(profile => {
      if (!profile.asruUser) {
        delete profile.asruLicensing;
        delete profile.asruInspector;
        delete profile.asruAdmin;
      }
      return profile;
    });
};

const router = Router({ mergeParams: true });

router.get('/', (req, res, next) => {
  Promise.resolve()
    .then(() => getSingleProfile(req))
    .then(profile => {
      res.response = profile;
      next();
    })
    .catch(next);
}, fetchOpenTasks);

router.put('/email',
  permissions('profile.update', req => ({ profileId: req.profileId })),
  whitelist('email'),
  validateEmail(),
  update()
);

router.put('/',
  permissions('profile.update', req => ({ profileId: req.profileId })),
  whitelist('firstName', 'lastName', 'dob', 'telephone'),
  validate(),
  updateDataAndStatus(),
  update()
);

module.exports = router;
