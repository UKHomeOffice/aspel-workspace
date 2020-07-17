const { get } = require('lodash');
const { ref } = require('objection');
const { UnauthorisedError, BadRequestError } = require('@asl/service/errors');
const {
  resolved,
  autoResolved,
  withLicensing,
  awaitingEndorsement,
  endorsed,
  withInspectorate
} = require('../../flow/status');
const { canEndorse } = require('../../util');

const Messager = require('../../messager');

module.exports = settings => {
  const { Project, Profile, ProjectVersion } = settings.models;
  const messager = Messager(settings);

  const needsEndorsement = (model) => {
    const isEndorsed = get(model, 'data.meta.authority', '').toLowerCase() === 'yes';
    const isTransfer = get(model, 'data.action') === 'transfer';
    const isAmendment = get(model, 'data.modelData.status') === 'active';
    // don't require re-endorsing
    if (isEndorsed) {
      return false;
    }
    // don't require endorsement on amendments
    if (!isTransfer && isAmendment) {
      return false;
    }
    return true;
  };

  function markContinuation(model) {
    const versionId = get(model, 'data.data.version');
    return Promise.resolve()
      .then(() => {
        return ProjectVersion.query().findById(versionId)
          .select(
            ref('data:project-continuation')
              .castJson()
              .as('continuation'),
            ref('data:transfer-expiring')
              .castBool()
              .as('expiring')
          );
      })
      .then(({ continuation, expiring }) => {
        if (expiring) {
          return model.patch({ continuation });
        }
      });
  }

  return model => {
    const action = get(model, 'data.action');
    const id = get(model, 'data.id');
    const changedBy = get(model, 'data.changedBy');

    switch (action) {
      case 'convert':
        return Promise.resolve()
          .then(() => Profile.query().findById(changedBy))
          .then(profile => {
            if (!profile.asruUser || !profile.asruLicensing) {
              throw new UnauthorisedError('Only ASRU LOs can convert legacy stubs');
            }
            return model.setStatus(autoResolved.id);
          });

      case 'create':
        const isLegacyStub = get(model, 'data.data.isLegacyStub', false);

        return Promise.resolve()
          .then(() => Profile.query().findById(changedBy))
          .then(profile => {
            if (isLegacyStub && (!profile.asruUser || !profile.asruLicensing)) {
              throw new UnauthorisedError('Only ASRU LOs can create legacy stubs');
            }
            return model.setStatus(autoResolved.id);
          });

      case 'delete':
      case 'delete-amendments':
      case 'fork':
        return model.setStatus(autoResolved.id);

      // update to the licence holder
      case 'update':
        return Project.query().findById(id)
          .then(project => {
            if (project.status === 'inactive') {
              return model.setStatus(autoResolved.id);

            } else if (project.isLegacyStub) {
              return Promise.resolve()
                .then(() => Profile.query().findById(changedBy))
                .then(profile => {
                  if (!profile.asruUser || !profile.asruLicensing) {
                    throw new UnauthorisedError('Only ASRU LOs can change the licence holder of a legacy stub');
                  }
                  return model.setStatus(autoResolved.id);
                });

            } else {
              return model.setStatus(withInspectorate.id);
            }
          });

      case 'update-licence-number':
      case 'update-issue-date':
        return Promise.resolve()
          .then(() => Profile.query().findById(changedBy))
          .then(profile => {
            if (!profile.asruUser) {
              throw new UnauthorisedError('Only ASRU can change this project property');
            }

            return model.setStatus(autoResolved.id);
          });

      case 'grant':
      case 'transfer':
        return Promise.resolve()
          .then(() => markContinuation(model))
          .then(() => {
            if (!needsEndorsement(model)) {
              return messager({ ...model.data, action: 'submit-draft' })
                .then(() => model.setStatus(withInspectorate.id));
            }
            if (canEndorse(model)) {
              return model.setStatus(endorsed.id);
            }
            return model.setStatus(awaitingEndorsement.id);
          });

      case 'transfer-draft':
        return Promise.resolve()
          .then(() => Project.query().findById(id))
          .then(project => {
            if (project.status !== 'inactive') {
              throw new BadRequestError(`cannot perform 'transfer-draft' action for a non-draft project`);
            }
            return model.setStatus(resolved.id);
          });

      case 'revoke':
        return Promise.resolve()
          .then(() => Profile.query().findById(changedBy))
          .then(profile => {
            if (!profile.asruUser) {
              // Project revoked by establishment user - needs inspector review
              return model.setStatus(withInspectorate.id);
            }

            if (profile.asruUser && profile.asruLicensing) {
              // Project revoked by licensing, does not need review
              return model.setStatus(resolved.id);
            }

            // Project revoked by other asru user - needs licensing review
            return model.setStatus(withLicensing.id);
          });
    }
  };
};
