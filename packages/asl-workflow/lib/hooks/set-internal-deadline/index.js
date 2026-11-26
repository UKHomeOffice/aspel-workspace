const { get } = require('lodash');
const dayJs = require('@ukhomeoffice/asl-components/dayjs');

const { addWorkingDaysIso } = dayJs;

const STANDARD_DEADLINE = 40;
const EXTENDED_DEADLINE = 55;
const RESUBMISSION_DEADLINE = 40;

const AMENDMENT_DEADLINE = 40;
const AMENDMENT_RESUBMISSION_DEADLINE = 40;

module.exports = () => {
  return task => {
    const model = get(task, 'data.model');
    const action = get(task, 'data.action');

    if (model !== 'project' || action !== 'grant') {
      return Promise.resolve();
    }

    let internalDeadline;

    const isAmendment = get(task, 'data.modelData.status') !== 'inactive';
    const resubmitted = task.activityLog.filter(a => /^status:.+:with-inspectorate$/.test(a.eventName)).length > 1;

    if (isAmendment) {
      const interval = resubmitted ? AMENDMENT_RESUBMISSION_DEADLINE : AMENDMENT_DEADLINE;
      const amendmentDeadline = addWorkingDaysIso(task.updatedAt, interval);
      internalDeadline = {
        standard: amendmentDeadline,
        extended: amendmentDeadline, // amendment deadline can't be extended
        resubmitted
      };
    } else {
      if (resubmitted) {
        const resubmissionDeadline = addWorkingDaysIso(task.updatedAt, RESUBMISSION_DEADLINE);
        internalDeadline = {
          standard: resubmissionDeadline,
          extended: resubmissionDeadline, // resubmission deadline can't be extended
          resubmitted
        };
      } else {
        internalDeadline = {
          standard: addWorkingDaysIso(task.updatedAt, STANDARD_DEADLINE),
          extended: addWorkingDaysIso(task.updatedAt, EXTENDED_DEADLINE),
          resubmitted
        };
      }
    }

    if (internalDeadline) {
      return task.patch({ internalDeadline });
    }

    return Promise.resolve();
  };
};
