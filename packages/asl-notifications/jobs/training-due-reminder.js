const moment = require('moment');
const Emailer = require('../lib/emailer');
const { uniqBy } = require('lodash');
const { query } = require('../../asl-schema/schema/base-model');

const buildRoleQueryWithCompletionDate = ({ Role, completeDate }) => {
  return Role.query()
    .select('roles.profileId', 'roles.establishmentId', 'roles.type', 'roles.trainingDelayDetails', 'profile.first_name', 'profile.last_name', 'establishment.name')
    .joinRelated('profile')
    .joinRelated('establishment')
    .whereRaw(`training_delay_details->>'completeDate' = '${completeDate}'`)
}

module.exports = async ({ schema, logger, publicUrl }) => {
  const { Role, Profile } = schema;
  const emailer = Emailer({ schema, logger, publicUrl });

  //TODO: Remove before merge
  // const roleQuery = buildRoleQueryWithCompletionDate({ Role, completeDate: '2026-01-01', emailer, logger });
  const notify3Months = buildRoleQueryWithCompletionDate({ Role, completeDate: moment().add(3, 'months').format('YYYY-MM-DD'), emailer });
  const notify1Months = buildRoleQueryWithCompletionDate({ Role, completeDate: moment().add(1, 'months').format('YYYY-MM-DD'), emailer });
  const notify1day = buildRoleQueryWithCompletionDate({ Role, completeDate: moment().add(1, 'days').format('YYYY-MM-DD'), emailer });
  logger.debug(`Finding roles with outstanding training`);

  const rolesWithTrainingOutstanding = await Promise.all([roleQuery, notify1day, notify1Months, notify3Months]);

  logger.debug(`Found ${rolesWithTrainingOutstanding.length} roles with training due in 3 months`);

  return Promise.all(rolesWithTrainingOutstanding.flat().map(role => {
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
          completeDate: role.trainingDelayDetails.completeDate
        }
      }
    });
  }));
};
