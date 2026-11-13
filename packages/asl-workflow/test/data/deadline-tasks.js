const { v4: uuid } = require('uuid');
const dayJs = require('@ukhomeoffice/asl-components/dayjs');

const { formatIsoDate } = dayJs;

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
        standard: formatIsoDate(dayJs().add(40, 'days')),
        extended: formatIsoDate(dayJs().add(55, 'days'))
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
        standard: formatIsoDate(dayJs().subtract(10, 'days')),
        extended: formatIsoDate(dayJs().add(5, 'days'))
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
        standard: formatIsoDate(dayJs().add(40, 'days')),
        extended: formatIsoDate(dayJs().add(55, 'days')),
        isExtended: false
      },
      internalDeadline: {
        standard: formatIsoDate(dayJs().add(40, 'days')),
        extended: formatIsoDate(dayJs().add(55, 'days'))
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
        standard: formatIsoDate(dayJs().add(40, 'days')),
        extended: formatIsoDate(dayJs().add(55, 'days')),
        isExtended: false
      },
      internalDeadline: {
        standard: formatIsoDate(dayJs().add(20, 'days')),
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
        standard: formatIsoDate(dayJs().add(35, 'days')),
        extended: formatIsoDate(dayJs().add(50, 'days')),
        isExtended: false
      },
      internalDeadline: {
        standard: formatIsoDate(dayJs().subtract(5, 'days')),
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
        standard: formatIsoDate(dayJs().subtract(30, 'days')),
        extended: formatIsoDate(dayJs().subtract(15, 'days')),
        isExtended: false
      },
      internalDeadline: {
        standard: formatIsoDate(dayJs().subtract(50, 'days'))
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
        standard: formatIsoDate(dayJs().add(40, 'days')),
        extended: formatIsoDate(dayJs().add(55, 'days')),
        isExtended: true
      },
      internalDeadline: {
        standard: formatIsoDate(dayJs().add(40, 'days')),
        extended: formatIsoDate(dayJs().add(55, 'days'))
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
        standard: formatIsoDate(dayJs().add(20, 'days')),
        extended: formatIsoDate(dayJs().add(35, 'days')),
        isExtended: true
      },
      internalDeadline: {
        standard: formatIsoDate(dayJs().subtract(20, 'days')),
        extended: formatIsoDate(dayJs().subtract(5, 'days'))
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
