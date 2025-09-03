const dictionary = require('@ukhomeoffice/asl-dictionary');
const { get } = require('lodash');
const moment = require('moment');
const taskHelper = require('../utils/task');
const { subscribed } = require('../utils/is-subscribed');

module.exports = async ({ schema, logger, task }) => {
  logger.verbose('generating notifications for establishment task');

  const notifications = new Map();
  const { Establishment, Profile } = schema;
  const applicantId = get(task, 'data.changedBy');
  const establishmentId = get(task, 'data.establishmentId') || get(task, 'data.modelData.id') || get(task, 'data.id');
  const action = get(task, 'data.action');
  const model = get(task, 'data.model');
  const dateFormat = 'D MMM YYYY';
  let version = get(task, 'data.meta.version');
  let subject;

  const allowedActions = {
    establishment: [
      'update',
      'update-conditions',
      'grant',
      'revoke',
      'suspend',
      'reinstate',
      'condition-reminder-1-month',
      'condition-reminder-1-week',
      'condition-reminder-today',
      'condition-reminder-overdue'
    ],
    place: ['create', 'update', 'delete'],
    role: ['create', 'delete', 'training-due-reminder']
  };

  if (!allowedActions[model].includes(action)) {
    logger.verbose(`ignoring task: ${model} ${action}`);
    return Promise.resolve(new Map());
  }

  const establishment = await Establishment.query().findById(establishmentId);
  const applicant = applicantId && await Profile.query().findById(applicantId);

  const pelh = await Profile.query()
    .joinRelated('roles')
    .where('roles.type', 'pelh')
    .where('roles.establishmentId', establishmentId);

  const admins = await Profile.query()
    .withGraphFetched('emailPreferences')
    .scopeToEstablishment('establishments.id', establishmentId, 'admin');

  const notifyUser = (recipient, params) => {
    logger.verbose(`${params.logMsg}, notifying licence holder / applicant`);
    notifications.set(recipient.id, { ...params, recipient });
  };

  const notifyPelh = params => {
    logger.verbose(`${params.logMsg}, notifying establishment licence holder(s)`);
    pelh.forEach(lh => {
      if (!notifications.has(lh.id)) {
        notifications.set(lh.id, { ...params, recipient: lh });
      }
    });
  };

  const notifyAdmins = (params, ignorePreferences = false) => {
    logger.verbose(`${params.logMsg}, notifying establishment admins`);
    admins.forEach(admin => {
      if (!subscribed({ establishmentId, licenceType: 'pel', profile: admin }) && !ignorePreferences) {
        return;
      }
      if (!notifications.has(admin.id)) {
        notifications.set(admin.id, { ...params, recipient: admin });
      }
    });
  };

  const notifyEnforcement = params => {
    logger.verbose(`${params.logMsg}, notifying enforcement unit`);
    const recipient = { id: 'asru', email: 'ASRUEnforcement@homeoffice.gov.uk', firstName: 'enforcement', lastName: 'team' };
    notifications.set(recipient.id, { ...params, recipient });
  };

  const notifyPilHolders = async params => {
    logger.verbose(`${params.logMsg}, notifying all PIL holders at the establishment`);
    const pilHolders = await Profile.query()
      .joinRelated('pil')
      .where('pil.establishmentId', establishmentId)
      .where('pil.status', 'active');

    pilHolders.forEach(pilh => {
      if (!notifications.has(pilh.id)) {
        notifications.set(pilh.id, { ...params, recipient: pilh });
      }
    });
  };

  const notifyPplHolders = async params => {
    logger.verbose(`${params.logMsg}, notifying all project licence holders at the establishment`);
    const pplHolders = await Profile.query()
      .joinRelated('projects')
      .where('projects.establishmentId', establishmentId)
      .where('projects.status', 'active');

    pplHolders.forEach(pplh => {
      if (!notifications.has(pplh.id)) {
        notifications.set(pplh.id, { ...params, recipient: pplh });
      }
    });
  };

  const params = {
    establishmentId,
    licenceNumber: establishment.licenceNumber,
    applicant
  };

  const setRoleParams = async params => {
    subject = await Profile.query().findById(task.data.data.profileId);
    let type = get(task, 'data.data.type');
    if (!type) {
      type = get(task, 'data.modelData.type', '');
    }
    params.roleName = dictionary[type.toUpperCase()];
    params.name = `${subject.firstName} ${subject.lastName}`;
    params.addTaskTypeToSubject = false;
  };

  const roleFlow = async params => {
    if (model === 'role' && (version || action === 'delete')) {
      await setRoleParams(params);
      if (version) {
        params.emailTemplate += version;
      }
      notifyPelh(params);
    } else {
      notifyUser(applicant, params);
    }
    notifyAdmins(params);
    return notifications;
  };

  if (applicant) {
    logger.debug(`applicant is ${applicant.firstName} ${applicant.lastName}`);
  }

  if (taskHelper.isReminderNotice(task)) {
    const when = get(task, 'data.when');
    const reminderId = task.data.reminder.id;
    const deadline = task.data.reminder.deadline;

    const reminderParams = {
      ...params,
      modelType: 'establishment',
      emailTemplate: 'condition-reminder',
      logMsg: `establishment condition is due ${when}`,
      addTaskTypeToSubject: false,
      when,
      deadline,
      identifier: `${reminderId}-${deadline}-${action}`
    };

    if (action === 'condition-reminder-overdue') {
      notifyEnforcement({
        ...reminderParams,
        emailTemplate: 'condition-reminder-overdue',
        logMsg: 'establishment condition is overdue'
      });

      return notifications;
    }

    notifyPelh(reminderParams);
    notifyAdmins(reminderParams);

    return notifications;
  }

  if (taskHelper.isSuspension(task)) {
    const suspensionParams = {
      ...params,
      modelType: 'establishment',
      emailTemplate: 'licence-suspended',
      logMsg: 'Establishment suspended',
      suspendedDate: establishment.suspendedDate && moment(establishment.suspendedDate).format(dateFormat),
      addTaskTypeToSubject: false
    };

    notifyPelh(suspensionParams);
    notifyAdmins(suspensionParams, true);
    await notifyPilHolders(suspensionParams);
    await notifyPplHolders(suspensionParams);

    return notifications;
  }

  if (taskHelper.isReinstatement(task)) {
    const reinstatementParams = {
      ...params,
      modelType: 'establishment',
      emailTemplate: 'licence-reinstated',
      logMsg: 'Establishment reinstated',
      suspendedDate: establishment.suspendedDate && moment(establishment.suspendedDate).format(dateFormat),
      reinstatedDate: moment().format(dateFormat),
      addTaskTypeToSubject: false
    };

    notifyPelh(reinstatementParams);
    notifyAdmins(reinstatementParams, true);
    await notifyPilHolders(reinstatementParams);
    await notifyPplHolders(reinstatementParams);

    return notifications;
  }

  if (model === 'role' && action === 'delete' && taskHelper.isGranted(task)) {
    const roleDeleteParams = { ...params, emailTemplate: 'role-removed', logMsg: 'role removed granted' };
    await setRoleParams(roleDeleteParams);
    notifyPelh(roleDeleteParams);
    notifyAdmins(roleDeleteParams);
    roleDeleteParams.emailTemplate = 'role-removed-subject';
    notifyUser(subject, roleDeleteParams);
    return notifications;
  }

  if (model === 'role' && action === 'training-due-reminder') {
    const { firstName, lastName, name, type, completeDate } = task.data.data;
    const fullName = `${firstName} ${lastName}`;
    const identifier = `${applicant.id}-${completeDate}-${action}`;

    const trainingDueReminderParams = {
      ...params,
      fullName,
      name,
      type,
      completeDate,
      identifier,
      emailTemplate: 'training-due-reminder',
      logMsg: 'training due reminder sent'
    };
    notifyPelh(trainingDueReminderParams);
    notifyAdmins(trainingDueReminderParams);
    notifyUser(applicant, trainingDueReminderParams);
    return notifications;
  }

  if (taskHelper.isWithApplicant(task)) {
    const withApplicantParams = { ...params, emailTemplate: 'task-action-required', logMsg: 'task is with applicant' };
    if (model === 'role' && task.status === 'recalled-by-applicant') {
      return notifications;
    }
    if (model === 'role' && action === 'delete') {
      withApplicantParams.emailTemplate = 'role-removed-returned';
    }
    return roleFlow(withApplicantParams);
  }

  if (taskHelper.isOverTheFence(task)) {
    if (model === 'role' && action === 'delete') {
      return notifications;
    }
    let overTheFenceParams = { ...params, emailTemplate: 'task-with-asru', logMsg: 'task is over the fence' };
    return roleFlow(overTheFenceParams);
  }

  if (taskHelper.isGranted(task)) {
    const emailTemplate = ['place', 'role'].includes(model) ? 'licence-amended' : 'licence-granted';
    const taskGrantedParams = { ...params, emailTemplate, logMsg: 'licence is granted' };
    await roleFlow(taskGrantedParams);
    if (model === 'role' && version) {
      taskGrantedParams.emailTemplate = 'role-approved-subject';
      notifyUser(subject, taskGrantedParams);
    }
    return notifications;
  }

  if (taskHelper.isClosed(task)) {
    const taskClosedParams = { ...params, emailTemplate: 'task-closed', logMsg: 'task is closed' };
    if (model === 'role' && task.status === 'discarded-by-applicant') {
      return notifications;
    }
    if (model === 'role' && action === 'delete') {
      taskClosedParams.emailTemplate = 'role-removed-refused';
    }
    return roleFlow(taskClosedParams);
  }

  return notifications;
};
