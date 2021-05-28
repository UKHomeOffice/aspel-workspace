const { get } = require('lodash');
const moment = require('moment');
const taskHelper = require('../utils/task');
const { subscribed, subscribedFilter } = require('../utils/is-subscribed');

module.exports = async ({ schema, logger, task }) => {
  logger.verbose('generating notifications for PIL task');

  const notifications = new Map();
  const { Profile, PIL } = schema;

  const pilId = get(task, 'data.id');
  const action = get(task, 'data.action');
  const months = get(task, 'data.months');
  const dateFormat = 'D MMM YYYY';

  const allowedActions = [
    'transfer',
    'grant',
    'update',
    'revoke',
    'review',
    'update-conditions',
    'review-due-3',
    'review-due-1',
    'review-overdue'
  ];

  if (!allowedActions.includes(action)) {
    logger.verbose(`ignoring task: pil ${action}`);
    return Promise.resolve(new Map());
  }

  const pil = await PIL.query().findById(pilId);
  const establishmentId = get(task, 'data.establishmentId') || pil.establishmentId;
  const outgoingEstablishmentId = get(task, 'data.data.establishment.from.id');
  const applicantId = get(task, 'data.subject') || pil.profileId;
  const applicant = applicantId && await Profile.query().findById(applicantId).withGraphFetched('[establishments]');

  const ntcos = await Profile.query()
    .scopeToEstablishment('establishments.id', establishmentId)
    .joinRelation('roles')
    .where('roles.type', 'ntco');

  const outgoingNtcos = await (
    outgoingEstablishmentId
      ? Profile.query()
        .scopeToEstablishment('establishments.id', outgoingEstablishmentId)
        .joinRelation('roles')
        .where('roles.type', 'ntco')
      : Promise.resolve([])
  );

  const admins = await Profile.query()
    .withGraphFetched('emailPreferences')
    .scopeToEstablishment('establishments.id', establishmentId, 'admin')
    .then(admins => admins.filter(subscribedFilter({ establishmentId, licenceType: 'pil' })));

  const outgoingAdmins = await (
    outgoingEstablishmentId
      ? Profile.query()
        .withGraphFetched('emailPreferences')
        .scopeToEstablishment('establishments.id', outgoingEstablishmentId, 'admin')
        .then(admins => admins.filter(subscribedFilter({ establishmentId: outgoingEstablishmentId, licenceType: 'pil' })))
      : Promise.resolve([])
  );

  const getCommonEstablishment = (admin, applicant) => {
    return admin.establishments.find(establishment => {
      return establishment.role === 'admin' && applicant.establishments.some(e => e.id === establishment.id);
    });
  };

  const nonOwningAdmins = await Promise.resolve()
    .then(() => applicant.establishments.filter(e => e.id !== establishmentId).map(e => e.id))
    .then(nonOwningEstablishmentIds => {
      if (nonOwningEstablishmentIds.length < 1) {
        return [];
      }

      return Profile.query()
        .withGraphFetched('[establishments, emailPreferences]')
        .joinRelation('establishments')
        .whereIn('establishmentId', nonOwningEstablishmentIds)
        .andWhere({ role: 'admin' })
        .whereNot('profiles.id', applicantId)
        .then(admins => admins.filter(admin => {
          admin.commonEstablishment = getCommonEstablishment(admin, applicant);
          return subscribed({ establishmentId: admin.commonEstablishment.id, licenceType: 'pil', profile: admin });
        }));
    });

  const notifyUser = (params) => {
    logger.verbose(`${params.logMsg}, notifying licence holder / applicant`);
    notifications.set(applicant.id, { ...params, recipient: applicant });
  };

  const notifyNTCOs = params => {
    logger.verbose(`${params.logMsg}, notifying NTCOs`);
    ntcos.forEach(ntco => notifications.set(ntco.id, { ...params, recipient: ntco }));
  };

  const notifyOutgoingNTCOs = params => {
    logger.verbose(`${params.logMsg}, notifying outgoing NTCOs`);
    outgoingNtcos.forEach(ntco => {
      if (!notifications.has(ntco.id)) {
        notifications.set(ntco.id, { ...params, recipient: ntco });
      }
    });
  };

  const notifyAdmins = params => {
    logger.verbose(`${params.logMsg}, notifying establishment admins`);
    admins.forEach(admin => notifications.set(admin.id, { ...params, recipient: admin }));
  };

  const notifyOutgoingAdmins = params => {
    logger.verbose(`${params.logMsg}, notifying outgoing establishment admins`);
    outgoingAdmins.forEach(admin => {
      if (!notifications.has(admin.id)) {
        notifications.set(admin.id, { ...params, recipient: admin });
      }
    });
  };

  const notifyNonOwningAdmins = params => {
    logger.verbose(`${params.logMsg}, notifying non-owning establishment admins`);
    nonOwningAdmins.forEach(admin => {
      if (!notifications.has(admin.id)) {
        notifications.set(admin.id, { ...params, recipient: admin, establishmentId: admin.commonEstablishment.id });
      }
    });
  };

  const params = {
    pilId,
    establishmentId,
    licenceNumber: pil && pil.licenceNumber,
    reviewDate: pil && pil.reviewDate && moment(pil.reviewDate).format(dateFormat),
    applicant
  };

  if (applicant) {
    logger.debug(`applicant / licence holder is ${applicant.firstName} ${applicant.lastName}`);
  }

  if (action.match(/^review-due-[\d]/)) {
    const reviewDueParams = {
      ...params,
      emailTemplate: 'pil-review-due',
      logMsg: `PIL review due in ${months} month(s)`,
      subject: `Reminder: personal licence ${pil.licenceNumber} is due a review in ${months === 1 ? '1 month' : `${months} months`}`,
      identifier: `${pil.id}-${action}`,
      months
    };

    notifyUser(reviewDueParams);
    return notifications;
  }

  if (action.match(/^review-overdue/)) {
    const reviewOverdueParams = {
      ...params,
      emailTemplate: 'pil-review-overdue',
      logMsg: 'PIL review overdue',
      subject: `Important: personal licence ${pil.licenceNumber} is overdue a review`,
      identifier: `${pil.id}-${action}`,
      months
    };

    notifyUser(reviewOverdueParams);
    notifyNTCOs(reviewOverdueParams);
    return notifications;
  }

  if (taskHelper.isNew(task) || taskHelper.isWithNtco(task)) {
    const newTaskParams = {
      ...params,
      emailTemplate: 'task-opened',
      logMsg: 'task is new'
    };

    notifyUser(newTaskParams);
    notifyNTCOs({ ...newTaskParams, emailTemplate: 'task-action-required', logMsg: 'PIL is awaiting endorsement' });
    notifyAdmins(newTaskParams);

    if (taskHelper.isTransfer(task)) {
      notifyOutgoingNTCOs(newTaskParams);
      notifyOutgoingAdmins(newTaskParams);
    }
    return notifications;
  }

  if (taskHelper.isWithApplicant(task)) {
    const withApplicantParams = {
      ...params,
      emailTemplate: 'task-action-required',
      logMsg: 'task is with applicant'
    };

    notifyUser(withApplicantParams);
    notifyNTCOs({ ...withApplicantParams, emailTemplate: 'task-change' });
    return notifications;
  }

  if (taskHelper.isOverTheFence(task)) {
    const overTheFenceParams = {
      ...params,
      emailTemplate: 'task-with-asru',
      logMsg: 'task is with ASRU'
    };

    notifyUser(overTheFenceParams);
    return notifications;
  }

  if (taskHelper.isResolved(task)) {
    switch (action) {
      case 'grant':
        const grantedParams = { ...params, emailTemplate: 'licence-granted', logMsg: 'licence granted' };
        notifyUser(grantedParams);
        notifyNTCOs(grantedParams);
        notifyAdmins(grantedParams);
        notifyNonOwningAdmins({ ...grantedParams, emailTemplate: 'associated-pil-granted' });
        break;

      case 'transfer':
        const transferredParams = { ...params, emailTemplate: 'licence-granted', logMsg: 'licence transferred' };
        notifyUser(transferredParams);
        notifyNTCOs(transferredParams);
        notifyAdmins(transferredParams);
        notifyOutgoingNTCOs({ ...transferredParams, emailTemplate: 'task-closed' });
        notifyOutgoingAdmins({ ...transferredParams, emailTemplate: 'task-closed' });
        notifyNonOwningAdmins({ ...transferredParams, emailTemplate: 'associated-pil-transferred' });
        break;

      case 'revoke':
        const revokedParams = { ...params, emailTemplate: 'task-closed', logMsg: 'licence revoked' };
        notifyUser(revokedParams);
        notifyNTCOs(revokedParams);
        notifyAdmins(revokedParams);
        notifyNonOwningAdmins({ ...revokedParams, emailTemplate: 'associated-pil-revoked' });
        break;

      default:
        const amendedParams = { ...params, emailTemplate: 'task-closed', logMsg: 'licence amended' };
        notifyUser(amendedParams);
        notifyNTCOs(amendedParams);
        notifyAdmins(amendedParams);
        notifyNonOwningAdmins({ ...amendedParams, emailTemplate: 'associated-pil-amended' });
    }

    return notifications;
  }

  if (taskHelper.isClosed(task)) {
    const taskClosedParams = { ...params, emailTemplate: 'task-closed', logMsg: 'task is closed' };

    notifyUser(taskClosedParams);
    notifyNTCOs(taskClosedParams);
    notifyAdmins(taskClosedParams);

    if (taskHelper.isTransfer(task)) {
      notifyOutgoingNTCOs(taskClosedParams);
      notifyOutgoingAdmins(taskClosedParams);
    }

    return notifications;
  }

  return notifications;
};
