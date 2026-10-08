const dayJs = require('@ukhomeoffice/asl-components/dayjs');
const Emailer = require('../lib/emailer');

const { formatIsoDate, todayIso } = dayJs;

module.exports = async ({ schema, logger, publicUrl }) => {
  const { Reminder } = schema;

  const emailer = Emailer({ schema, logger, publicUrl });

  const reminderNotice = async ({ value, unit }) => {
    const when = value ? `in ${value} ${unit}` : unit;
    const action = `condition-reminder-${value ? `${value}-${unit}` : unit}`;

    logger.debug(`Looking for reminders due ${when}`);

    const query = Reminder.query().where('status', 'active');

    switch (unit) {
      case 'overdue':
        query.where('deadline', '=', formatIsoDate(dayJs().subtract(1, 'day')));
        break;

      case 'today':
        query.where('deadline', '=', todayIso());
        break;

      case 'week':
        query.where('deadline', '>', todayIso())
          .where('deadline', '<=', formatIsoDate(dayJs().add(value, 'week')));
        break;

      case 'month':
        query.where('deadline', '>', formatIsoDate(dayJs().add(1, 'week')))
          .where('deadline', '<=', formatIsoDate(dayJs().add(value, 'month')));
        break;
    }

    const reminders = await query;

    logger.debug(`Found ${reminders.length} reminders due`);

    return Promise.all(reminders.map(reminder => emailer({
      event: 'direct-notification',
      data: {
        id: reminder.modelId,
        model: reminder.modelType,
        establishmentId: reminder.establishmentId,
        when,
        action,
        reminder
      }
    })));
  };

  await reminderNotice({ value: 1, unit: 'month' });
  await reminderNotice({ value: 1, unit: 'week' });
  await reminderNotice({ unit: 'today' });
  await reminderNotice({ unit: 'overdue' });
};
