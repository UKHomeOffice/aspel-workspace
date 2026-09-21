const { get } = require('lodash');
const dayJs = require('@ukhomeoffice/asl-components/src/dayjs.js');
const { bankHolidays } = require('@ukhomeoffice/asl-constants');
const { withInspectorate } = require('../../flow/status');

const STANDARD_DEADLINE = 40;
const EXTENDED_DEADLINE = 55;

// configure bank holidays
dayJs.updateLocale('en', { holidays: bankHolidays });

const daysSinceDate = date => dayJs().diff(dayJs(date), 'days');

module.exports = task => {
  let deadline = get(task, 'data.deadline');

  if (!deadline || !deadline.standard) {
    const lastSubmitted = task.activityLog.reduce((lastSubmission, activity) => {
      const status = activity.eventName.split(':').pop();
      if (status === withInspectorate.id && dayJs(lastSubmission).isBefore(activity.createdAt)) {
        return activity.createdAt;
      }
      return lastSubmission;
    }, task.createdAt);

    const isExtended = (deadline && deadline.isExtended) || get(task, 'data.extended', false); // old location of extended flag for BC

    deadline = {
      standard: dayJs(lastSubmitted).addWorkingTime(STANDARD_DEADLINE, 'days').format('YYYY-MM-DD'),
      extended: dayJs(lastSubmitted).addWorkingTime(EXTENDED_DEADLINE, 'days').format('YYYY-MM-DD'),
      isExtended,
      isExtendable: !!(task.isOpen && !isExtended)
    };
  } else {
    deadline.isExtendable = !!(task.isOpen && !deadline.isExtended);
  }

  const deadlineDate = get(deadline, deadline.isExtended ? 'extended' : 'standard');
  deadline.daysSince = daysSinceDate(deadlineDate); // will be negative until deadline day, does not care about working days

  return deadline;
};
