const { pick } = require('lodash');
const normaliseEmail = email => (email || '').trim().toLowerCase();

module.exports = ({ models, jwt, emailer }) => ({ action, data, id }, transaction) => {
  const { Invitation, Establishment, Permission, Profile } = models;

  const sendInvitation = args => {
    const changelog = [];
    return Promise.resolve()
      .then(() => jwt.sign(args))
      .then(token => {
        return Promise.resolve()
          .then(() => {
            return Invitation.upsert({ ...args, token }, {
              establishmentId: args.establishmentId,
              email: args.email
            }, transaction);
          })
          .then(() => Invitation.query(transaction).where({ establishmentId: args.establishmentId, email: args.email }))
          .then(invitations => invitations[0])
          .then(invitation => {
            changelog.push({
              model: 'invitation',
              state: invitation
            });
          })
          .then(() => Establishment.query(transaction).findById(args.establishmentId))
          .then(establishment => emailer.sendEmail({ ...args, token, establishment, template: 'invitation' }))
          .then(() => changelog);
      });
  };

  if (action === 'create') {
    const args = {
      email: data.email,
      establishmentId: data.establishmentId,
      role: data.role
    };
    return sendInvitation(args);
  }

  if (action === 'resend') {
    return Promise.resolve()
      .then(() => Invitation.query(transaction).findById(id))
      .then(invitation => sendInvitation(pick(invitation, 'email', 'establishmentId', 'role')));
  }

  if (action === 'accept') {
    const changelog = [];
    return Promise.resolve()
      .then(() => Promise.all([
        Invitation.query(transaction).findById(data.id),
        Profile.query(transaction).findById(data.profileId)
      ]))
      .then(([invitation, profile]) => {
        if (!invitation || !profile) {
          throw new Error('Invitation not found');
        }

        const invitationEmail = normaliseEmail(invitation.email);
        const profileEmail = normaliseEmail(profile.email);
        const requestEmail = normaliseEmail(data.email);

        if (invitationEmail !== profileEmail || (requestEmail && requestEmail !== profileEmail)) {
          throw new Error('Invitation email mismatch');
        }

        return Promise.resolve()
          .then(() => {
            return Permission.upsert({
              role: invitation.role,
              establishmentId: invitation.establishmentId,
              profileId: data.profileId,
              deleted: null
            }, {
              establishmentId: invitation.establishmentId,
              profileId: data.profileId
            }, transaction);
          })
          .then(() => Permission.query(transaction).where({ establishmentId: invitation.establishmentId, profileId: data.profileId }))
          .then(permissions => permissions[0])
          .then(permission => {
            changelog.push({
              model: 'permission',
              state: permission
            });
          })
          .then(() => {
            return Invitation.query(transaction).where({
              id: data.id
            })
              .delete()
              .returning('*');
          })
          .then(invitation => invitation[0])
          .then(invitation => {
            changelog.push({
              model: 'invitation',
              state: invitation
            });
          })
          .then(() => changelog);
      });
  }

  if (action === 'cancel') {
    return Invitation.query(transaction).findById(id).patch({ token: null }).returning('*');
  }

  if (action === 'delete') {
    return Invitation.query(transaction).findById(id).delete()
      .then(() => Invitation.queryWithDeleted(transaction).findById(id));
  }

  return Promise.reject(new Error(`Unknown action: ${action}`));
};
