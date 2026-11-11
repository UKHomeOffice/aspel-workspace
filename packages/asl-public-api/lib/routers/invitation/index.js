const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { NotFoundError } = require('../../errors');

const normaliseEmail = email => (email || '').trim().toLowerCase();

module.exports = settings => {
  const router = Router({ mergeParams: true });

  if (!settings.jwt || !settings.jwt.secret) {
    throw new Error('JWT secret must be defined');
  }

  router.param('token', (req, res, next, token) => {
    const { Invitation } = req.models;
    Promise.resolve()
      .then(() => {
        const decodedToken = jwt.verify(token, settings.jwt.secret);
        if (!decodedToken.exp) {
          throw new NotFoundError();
        }
      })
      .then(() => Invitation.query().where({ token: req.params.token }))
      .then(result => result[0])
      .then(invitation => {
        if (!invitation) {
          throw new NotFoundError();
        }
        req.invitation = invitation;
      })
      .then(() => next())
      .catch(() => next(new NotFoundError()));
  });

  router.get('/:token', (req, res, next) => {
    const { Establishment } = req.models;
    return Establishment.query().findById(req.invitation.establishmentId)
      .then(establishment => {
        res.response = req.invitation;
        res.meta.establishment = establishment;
        next();
      })
      .catch(next);
  });

  router.put('/:token', (req, res, next) => {
    const profileEmail = normaliseEmail(req.user.profile.email);
    const invitationEmail = normaliseEmail(req.invitation.email);

    if (!req.user.profile.emailConfirmed || profileEmail !== invitationEmail) {
      return next(new NotFoundError());
    }

    const params = {
      action: 'accept',
      model: 'invitation',
      id: req.invitation.id,
      data: {
        id: req.invitation.id,
        profileId: req.user.profile.id,
        email: req.user.profile.email
      }
    };
    req.workflow.update(params)
      .then(response => {
        res.response = response;
        next();
      })
      .catch(next);
  });

  return router;
};
