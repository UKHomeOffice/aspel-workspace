const { v4: uuid } = require('uuid');
const dayJs = require('@ukhomeoffice/asl-components/src/dayjs.js');

const now = dayJs();

const getTimestamps = () => {
  now.add(1, 'ms');
  return {
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
};

module.exports = [
  {
    id: uuid(),
    data: {
      data: {
        name: 'active deadline is internal standard (no statutory)',
        licenceHolderId: uuid()
      },
      internalDeadline: {
        standard: dayJs().add(40, 'days').format('YYYY-MM-DD'),
        extended: dayJs().add(55, 'days').format('YYYY-MM-DD')
      },
      id: uuid(),
      initiatedByAsru: false,
      establishmentId: 100,
      subject: uuid(),
      model: 'project',
      modelData: {
        status: 'inactive',
        licenceHolderId: uuid()
      },
      action: 'grant',
      changedBy: uuid()
    },
    status: 'with-inspectorate',
    ...getTimestamps()
  },
  {
    id: uuid(),
    data: {
      data: {
        name: 'active deadline is internal standard (internal overdue, no statutory)',
        licenceHolderId: uuid()
      },
      internalDeadline: {
        standard: dayJs().subtract(10, 'days').format('YYYY-MM-DD'),
        extended: dayJs().add(5, 'days').format('YYYY-MM-DD')
      },
      id: uuid(),
      initiatedByAsru: false,
      establishmentId: 100,
      subject: uuid(),
      model: 'project',
      modelData: {
        status: 'inactive',
        licenceHolderId: uuid()
      },
      action: 'grant',
      changedBy: uuid()
    },
    status: 'with-inspectorate',
    ...getTimestamps()
  },
  {
    id: uuid(),
    data: {
      data: {
        name: 'active deadline is internal/statutory standard (internal and statutory the same)',
        licenceHolderId: uuid()
      },
      meta: { authority: true, awerb: true, ready: true },
      deadline: {
        standard: dayJs().add(40, 'days').format('YYYY-MM-DD'),
        extended: dayJs().add(55, 'days').format('YYYY-MM-DD'),
        isExtended: false
      },
      internalDeadline: {
        standard: dayJs().add(40, 'days').format('YYYY-MM-DD'),
        extended: dayJs().add(55, 'days').format('YYYY-MM-DD')
      },
      id: uuid(),
      initiatedByAsru: false,
      establishmentId: 100,
      subject: uuid(),
      model: 'project',
      modelData: {
        status: 'inactive',
        licenceHolderId: uuid()
      },
      action: 'grant',
      changedBy: uuid()
    },
    status: 'with-inspectorate',
    ...getTimestamps()
  },
  {
    id: uuid(),
    data: {
      data: {
        name: 'active deadline is internal standard (internal earlier)',
        licenceHolderId: uuid()
      },
      meta: { authority: true, awerb: true, ready: true },
      deadline: {
        standard: dayJs().add(40, 'days').format('YYYY-MM-DD'),
        extended: dayJs().add(55, 'days').format('YYYY-MM-DD'),
        isExtended: false
      },
      internalDeadline: {
        standard: dayJs().add(20, 'days').format('YYYY-MM-DD'),
        resubmitted: true
      },
      id: uuid(),
      initiatedByAsru: false,
      establishmentId: 100,
      subject: uuid(),
      model: 'project',
      modelData: {
        status: 'inactive',
        licenceHolderId: uuid()
      },
      action: 'grant',
      changedBy: uuid()
    },
    status: 'with-inspectorate',
    ...getTimestamps()
  },
  {
    id: uuid(),
    data: {
      data: {
        name: 'active deadline is statutory standard (internal expired)',
        licenceHolderId: uuid()
      },
      meta: { authority: true, awerb: true, ready: true },
      deadline: {
        standard: dayJs().add(35, 'days').format('YYYY-MM-DD'),
        extended: dayJs().add(50, 'days').format('YYYY-MM-DD'),
        isExtended: false
      },
      internalDeadline: {
        standard: dayJs().subtract(5, 'days').format('YYYY-MM-DD'),
        resubmitted: true
      },
      id: uuid(),
      initiatedByAsru: false,
      establishmentId: 100,
      subject: uuid(),
      model: 'project',
      modelData: {
        status: 'inactive',
        licenceHolderId: uuid()
      },
      action: 'grant',
      changedBy: uuid()
    },
    status: 'with-inspectorate',
    ...getTimestamps()
  },
  {
    id: uuid(),
    data: {
      data: {
        name: 'active deadline is statutory standard (both expired)',
        licenceHolderId: uuid()
      },
      meta: { authority: true, awerb: true, ready: true },
      deadline: {
        standard: dayJs().subtract(30, 'days').format('YYYY-MM-DD'),
        extended: dayJs().subtract(15, 'days').format('YYYY-MM-DD'),
        isExtended: false
      },
      internalDeadline: {
        standard: dayJs().subtract(50, 'days').format('YYYY-MM-DD')
      },
      id: uuid(),
      initiatedByAsru: false,
      establishmentId: 100,
      subject: uuid(),
      model: 'project',
      modelData: {
        status: 'inactive',
        licenceHolderId: uuid()
      },
      action: 'grant',
      changedBy: uuid()
    },
    status: 'with-inspectorate',
    ...getTimestamps()
  },
  {
    id: uuid(),
    data: {
      data: {
        name: 'active deadline is internal/statutory extended (internal and statutory the same)',
        licenceHolderId: uuid()
      },
      meta: { authority: true, awerb: true, ready: true },
      deadline: {
        standard: dayJs().add(40, 'days').format('YYYY-MM-DD'),
        extended: dayJs().add(55, 'days').format('YYYY-MM-DD'),
        isExtended: true
      },
      internalDeadline: {
        standard: dayJs().add(40, 'days').format('YYYY-MM-DD'),
        extended: dayJs().add(55, 'days').format('YYYY-MM-DD')
      },
      id: uuid(),
      initiatedByAsru: false,
      establishmentId: 100,
      subject: uuid(),
      model: 'project',
      modelData: {
        status: 'inactive',
        licenceHolderId: uuid()
      },
      action: 'grant',
      changedBy: uuid()
    },
    status: 'with-inspectorate',
    ...getTimestamps()
  },
  {
    id: uuid(),
    data: {
      data: {
        name: 'active deadline is statutory extended (internal expired)',
        licenceHolderId: uuid()
      },
      meta: { authority: true, awerb: true, ready: true },
      deadline: {
        standard: dayJs().add(20, 'days').format('YYYY-MM-DD'),
        extended: dayJs().add(35, 'days').format('YYYY-MM-DD'),
        isExtended: true
      },
      internalDeadline: {
        standard: dayJs().subtract(20, 'days').format('YYYY-MM-DD'),
        extended: dayJs().subtract(5, 'days').format('YYYY-MM-DD')
      },
      id: uuid(),
      initiatedByAsru: false,
      establishmentId: 100,
      subject: uuid(),
      model: 'project',
      modelData: {
        status: 'inactive',
        licenceHolderId: uuid()
      },
      action: 'grant',
      changedBy: uuid()
    },
    status: 'with-inspectorate',
    ...getTimestamps()
  }
];
