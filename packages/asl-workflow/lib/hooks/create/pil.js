const { get } = require('lodash');
const { BadRequestError } = require('@asl/service/errors');
const { autoResolved, awaitingEndorsement, withLicensing } = require('../../flow/status');
const { canEndorse } = require('../../util');

module.exports = settings => {
  const { PIL } = settings.models;
  return model => {
    const action = get(model, 'data.action');
    const profile = get(model, 'meta.user.profile', {});
    const pilId = get(model, 'data.id');
    const changedBy = get(model, 'data.changedBy');

    switch (action) {
      case 'update-conditions':
        if (!profile.asruUser) {
          throw new BadRequestError('Only ASRU users can update licence conditions');
        }
        if (profile.asruUser && profile.asruLicensing) {
          return model.setStatus(autoResolved.id);
        }
        return model.setStatus(withLicensing.id);

      case 'create':
        // new in-progress PIL (user hasn't submitted to NTCO yet), does not need review
        return model.setStatus(autoResolved.id);

      case 'delete':
        return Promise.resolve()
          .then(() => PIL.query().findById(pilId))
          .then(pil => {
            if (pil.status !== 'pending') {
              throw new BadRequestError('Only draft PILs can be deleted');
            }
          })
          .then(() => model.setStatus(autoResolved.id));

      case 'revoke':
        if (profile.asruUser && profile.asruLicensing) {
          // PIL revoked by licensing, does not need review
          return model.setStatus(autoResolved.id);
        }
        // PIL revoked by establishment user - needs licensing review.
        return model.setStatus(withLicensing.id);

      case 'grant':
        if (profile.asruUser && profile.asruLicensing) {
          return model.setStatus(autoResolved.id);
        }
        if (profile.asruUser) {
          return model.setStatus(withLicensing.id);
        }
        // PIL submitted to NTCO, needs review
        return model.setStatus(awaitingEndorsement.id);

      case 'review':
        if (canEndorse(model)) {
          return model.setStatus(autoResolved.id);
        }
        return model.setStatus(awaitingEndorsement.id);

      case 'transfer':
        if (profile.id !== changedBy) {
          throw new BadRequestError('Only the PIL\'s owner can transfer a PIL');
        }
        // PIL submitted to NTCO, needs review
        return model.setStatus(awaitingEndorsement.id);
    }
  };
};
