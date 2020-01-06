const { Router } = require('express');
const { NotFoundError, UnauthorisedError, BadRequestError } = require('@asl/service/errors');

const { get } = require('lodash');

const hasRole = require('../middleware/has-role');
const whitelist = require('../middleware/whitelist');
const pil = require('./pil');

const notSelf = () => (req, res, next) => {
  if (req.user.profile.id === req.profile.id) {
    throw new UnauthorisedError();
  }
  next();
};

const update = (action = 'update') => (req, res, next) => {
  const params = {
    action,
    model: 'profile',
    id: req.profile.id,
    data: req.body.data,
    meta: req.body.meta
  };

  req.workflow.update(params)
    .then(response => {
      res.response = response;
      next();
    })
    .catch(next);
};

module.exports = () => {

  const router = Router();

  router.param('profileId', (req, res, next, id) => {
    const { Profile, Project } = req.models;

    return Profile.query().findOne({ id })
      .eager('[roles.places, establishments, pil, certificates, exemptions, asru(orderByName)]', {
        orderByName: (builder) => {
          builder.orderBy('name');
        }
      })
      .then(profile => {
        if (!profile) {
          return next(new NotFoundError());
        }
        req.profile = profile;
      })
      .then(() => {
        const query = Project.query()
          .distinct('projects.*')
          .where({ licenceHolderId: req.profile.id });
        return Project.filterUnsubmittedDrafts(query);
      })
      .then(projects => {
        req.profile.projects = projects;
      })
      .then(() => next())
      .catch(next);
  });

  router.use('/:profileId/pil', pil());

  router.put('/:profileId',
    hasRole('admin'),
    whitelist('asruUser', 'asruAdmin', 'asruLicensing', 'asruInspector'),
    notSelf(),
    update()
  );

  router.get('/:profileId', (req, res, next) => {
    res.response = req.profile;
    next();
  });

  router.post('/:profileId/merge',
    notSelf(),
    (req, res, next) => {
      const { Profile } = req.models;
      const id = get(req.body, 'data.target');
      return Profile.query().findOne({ id })
        .then(profile => {
          if (!profile) {
            throw new NotFoundError();
          }
          if (profile.asruUser) {
            throw new BadRequestError('Cannot merge profiles with an ASRU user');
          }
          return profile;
        })
        .then(profile => req.workflow.profileTasks({ profileId: req.profile.id }))
        .then(response => {
          if (response.json.data.length) {
            throw new BadRequestError('Cannot merge profile with open tasks.');
          }
        })
        .then(() => next())
        .catch(next);
    },
    update('merge')
  );

  return router;

};
