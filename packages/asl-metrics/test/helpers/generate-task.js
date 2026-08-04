const { randomUUID } = require('crypto');
const { omit, cloneDeep } = require('lodash');

const moment = require('moment-business-time');
const { bankHolidays } = require('@ukhomeoffice/asl-constants');
moment.updateLocale('en', { holidays: bankHolidays });

const generateTask = ({
  model = 'project',
  action = 'grant',
  type = 'application',
  deadline,
  internalDeadline,
  createdAt = '2021-12-01'
}) => {
  const id = randomUUID();

  // add a second to avoid falling directly on midnight
  const normalisedCreatedAt = moment(createdAt).add(1, 'second').toISOString();

  return {
    id,
    data: {
      action,
      model,
      modelData: {
        title: `${model} ${type} ${action} ${id}`,
        licenceNumber: `XX-${id}`,
        status: type === 'application' ? 'inactive' : 'active'
      },
      deadline,
      internalDeadline
    },
    type,
    status: 'new',
    created_at: normalisedCreatedAt,
    updated_at: normalisedCreatedAt,
    activity: [
      {
        id: randomUUID(),
        case_id: id,
        event_name: 'create',
        event: { status: 'new' },
        created_at: normalisedCreatedAt,
        updated_at: normalisedCreatedAt
      }
    ],
    history: function(status, daysOffset = 1, resubmission = false) {
      let eventName = status;

      if (status !== 'assign') {
        const previousStatus = this.status;
        this.status = status;
        eventName = `status:${previousStatus}:${status}`;
      }

      this.updated_at = moment(this.updated_at)
        .addWorkingTime(daysOffset, 'days')
        .add(this.activity.length, 'milliseconds') // add some ms to spread out activity
        .toISOString();

      if (resubmission) {
        const interval = this.type === 'amendment' ? 15 : 20;
        this.data.internalDeadline = {
          standard: moment(this.updated_at).addWorkingTime(interval, 'days').format('YYYY-MM-DD'),
          resubmitted: true
        };
      }

      this.activity.push({
        id: randomUUID(),
        case_id: this.id,
        event_name: eventName,
        event: cloneDeep(omit(this, ['activity', 'history'])),
        created_at: this.updated_at,
        updated_at: this.updated_at
      });
    }
  };
};

module.exports = generateTask;
