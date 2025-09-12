const moment = require('moment');
const Emailer = require('../lib/emailer');

const buildRoleQueryWithCompletionDate = ({ Role, dates }) => {
  return Role.query()
    .select(
      'roles.id',
      'roles.profileId',
      'roles.establishmentId',
      'roles.type',
      'roles.trainingDelayDetails',
      'profile.first_name',
      'profile.last_name',
      'establishment.name'
    )
    .joinRelated('profile')
    .joinRelated('establishment')
    .whereRaw(
      `training_delay_details->>'completeDate' IN (${dates.map(() => '?').join(', ')})`,
      dates
    );
};

module.exports = async ({ schema, logger, publicUrl }) => {
  const { Role } = schema;
  const emailer = Emailer({ schema, logger, publicUrl });

  const completeDatesToQuery = [
    moment().add(3, 'months').format('YYYY-MM-DD'),
    moment().add(1, 'months').format('YYYY-MM-DD'),
    moment().add(1, 'days').format('YYYY-MM-DD')
  ];

  logger.debug(`Finding roles with outstanding training`);

  const rolesWithTrainingOutstanding = await buildRoleQueryWithCompletionDate({ Role, dates: completeDatesToQuery });

  logger.debug(`Found ${rolesWithTrainingOutstanding.length} roles with training due reminders to send`);

  return Promise.all(rolesWithTrainingOutstanding.map(role =>
    emailer({
      event: 'direct-notification',
      data: {
        id: role.id,
        model: 'role',
        establishmentId: role.establishmentId,
        action: 'training-due-reminder',
        status: 'training-due-reminder',
        changedBy: role.profileId,
        data: {
          type: role.type,
          firstName: role.firstName,
          lastName: role.lastName,
          name: role.name,
          completeDate: moment(role.trainingDelayDetails.completeDate).format('DD MMM YYYY')
        }
      }
    })));
};
