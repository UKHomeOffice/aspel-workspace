const { v4: uuid } = require('uuid');
const dayJs = require('@ukhomeoffice/asl-components/src/dayjs.js');
const ids = require('./ids');
const { asruSuper } = require('./profiles');

const generateDates = daysAgo => {
  const date = dayJs().subtract(daysAgo, 'days').toISOString();
  return {
    createdAt: date,
    updatedAt: date
  };
};

const activity = [
  {
    id: uuid(),
    caseId: ids.task.project.discardedByAsru,
    changedBy: asruSuper.id,
    eventName: 'status:with-inspectorate:discarded-by-asru',
    event: {},
    ...generateDates(34)
  },
  {
    id: uuid(),
    caseId: ids.task.assignedToLicensing,
    changedBy: asruSuper.id,
    eventName: 'assign',
    event: {},
    ...generateDates(34)
  }
];

module.exports = activity;
