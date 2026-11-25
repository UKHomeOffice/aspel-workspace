const { Router } = require('express');
const { NotFoundError } = require('../../errors');

const router = Router({ mergeParams: true });

// Tokens are only ever written by the resolver, so a DB match proves the signature;
// the claims are checked here to enforce expiry and that the token belongs to the invitation.
const decodeToken = token => {
  try {
    const [, payload] = token.split('.');
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch (e) {
    return null;
  }
};

const isValidToken = (token, invitation) => {
  const claims = decodeToken(token);
  return !!claims &&
    typeof claims.exp === 'number' &&
    claims.exp * 1000 > Date.now() &&
    claims.establishmentId === invitation.establishmentId &&
    claims.role === invitation.role &&
    typeof claims.email === 'string' &&
    claims.email.toLowerCase() === String(invitation.email).toLowerCase();
};

router.param('token', (req, res, next, token) => {
  const { Invitation } = req.models;
  Invitation.query().where({ token: req.params.token })
    .then(result => result[0])
    .then(invitation => {
      if (!invitation || !isValidToken(token, invitation)) {
        throw new NotFoundError();
      }
      req.invitation = invitation;
      next();
    })
    .catch(next);
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
  const params = {
    action: 'accept',
    model: 'invitation',
    id: req.invitation.id,
    data: {
      id: req.invitation.id,
      profileId: req.user.profile.id
    }
  };
  req.workflow.update(params)
    .then(response => {
      res.response = response;
      next();
    })
    .catch(next);
});

module.exports = router;
module.exports.isValidToken = isValidToken;
