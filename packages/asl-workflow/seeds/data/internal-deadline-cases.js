const dayJs = require('@ukhomeoffice/asl-components/dayjs');
const { formatIsoDate } = dayJs;

const STANDARD_DEADLINE = 40;
const EXTENDED_DEADLINE = 55;
const RESUBMISSION_DEADLINE = 20;

const projects = [
  {
    title: 'Internal deadline future',
    licenceNumber: 'INTDL-FUT',
    data: {
      internalDeadline: {
        standard: formatIsoDate(dayJs().addWorkingTime(STANDARD_DEADLINE, 'days')),
        extended: formatIsoDate(dayJs().addWorkingTime(EXTENDED_DEADLINE, 'days'))
      }
    }
  },
  {
    title: 'Internal deadline urgent',
    licenceNumber: 'INTDL-URG',
    data: {
      internalDeadline: {
        standard: formatIsoDate(dayJs().addWorkingTime(5, 'days')),
        extended: formatIsoDate(dayJs().addWorkingTime(20, 'days'))
      }
    },
    date: formatIsoDate(dayJs().subtractWorkingTime(STANDARD_DEADLINE - 5, 'days'))
  },
  {
    title: 'Internal deadline past',
    licenceNumber: 'INTDL-PAST',
    data: {
      internalDeadline: {
        standard: formatIsoDate(dayJs().subtractWorkingTime(2, 'days')),
        extended: formatIsoDate(dayJs().subtractWorkingTime(2, 'days'))
      }
    },
    date: formatIsoDate(dayJs().subtractWorkingTime(STANDARD_DEADLINE + 2, 'days'))
  },
  {
    title: 'Internal deadline future, statutory deadline future (same date)',
    licenceNumber: 'INTDL-STAT-FUT',
    data: {
      internalDeadline: {
        standard: formatIsoDate(dayJs().addWorkingTime(STANDARD_DEADLINE, 'days')),
        extended: formatIsoDate(dayJs().addWorkingTime(EXTENDED_DEADLINE, 'days'))
      },
      deadline: {
        standard: formatIsoDate(dayJs().addWorkingTime(STANDARD_DEADLINE, 'days')),
        extended: formatIsoDate(dayJs().addWorkingTime(EXTENDED_DEADLINE, 'days')),
        isExtended: false
      }
    }
  },
  {
    title: 'Internal deadline future, statutory deadline future (internal earlier)',
    licenceNumber: 'INTDL-EARLY-STAT',
    data: {
      internalDeadline: {
        standard: formatIsoDate(dayJs().addWorkingTime(RESUBMISSION_DEADLINE, 'days')),
        extended: formatIsoDate(dayJs().addWorkingTime(RESUBMISSION_DEADLINE, 'days'))
      },
      deadline: {
        standard: formatIsoDate(dayJs().addWorkingTime(STANDARD_DEADLINE, 'days')),
        extended: formatIsoDate(dayJs().addWorkingTime(EXTENDED_DEADLINE, 'days')),
        isExtended: false
      }
    }
  },
  {
    title: 'Internal deadline past, statutory deadline future',
    licenceNumber: 'INTDL-PAST-STAT-FUT',
    data: {
      internalDeadline: {
        standard: formatIsoDate(dayJs().subtractWorkingTime(2, 'days')),
        extended: formatIsoDate(dayJs().subtractWorkingTime(2, 'days'))
      },
      deadline: {
        standard: formatIsoDate(dayJs().addWorkingTime(STANDARD_DEADLINE, 'days')),
        extended: formatIsoDate(dayJs().addWorkingTime(EXTENDED_DEADLINE, 'days')),
        isExtended: false
      }
    },
    date: formatIsoDate(dayJs().subtractWorkingTime(RESUBMISSION_DEADLINE + 2, 'days'))
  },
  {
    title: 'Internal deadline past, statutory deadline past',
    licenceNumber: 'INTDL-PAST-STAT-PAST',
    data: {
      internalDeadline: {
        standard: formatIsoDate(dayJs().subtractWorkingTime(2, 'days')),
        extended: formatIsoDate(dayJs().subtractWorkingTime(13, 'days'))
      },
      deadline: {
        standard: formatIsoDate(dayJs().subtractWorkingTime(2, 'days')),
        extended: formatIsoDate(dayJs().addWorkingTime(13, 'days')),
        isExtended: false
      }
    },
    date: formatIsoDate(dayJs().subtractWorkingTime(STANDARD_DEADLINE + 2, 'days'))
  }
];

module.exports = async makeTask => {
  const meta = { authority: true, awerb: true, ready: true };
  return Promise.all(projects.map(opts => {
    // if we always include complete & correct meta we'll end up with statutory deadlines
    // auto-added where we're not expecting, so don't do that
    return opts.licenceNumber.includes('STAT')
      ? makeTask({ model: 'project', meta, ...opts })
      : makeTask({ model: 'project', ...opts });
  }));
};
