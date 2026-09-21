const dayJs = require('@ukhomeoffice/asl-components/src/dayjs.js');
const { bankHolidays } = require('@ukhomeoffice/asl-constants');
dayJs.updateLocale('en', { holidays: bankHolidays });

const STANDARD_DEADLINE = 40;
const EXTENDED_DEADLINE = 55;
const RESUBMISSION_DEADLINE = 20;

const projects = [
  {
    title: 'Internal deadline future',
    licenceNumber: 'INTDL-FUT',
    data: {
      internalDeadline: {
        standard: dayJs().addWorkingTime(STANDARD_DEADLINE, 'days').format('YYYY-MM-DD'),
        extended: dayJs().addWorkingTime(EXTENDED_DEADLINE, 'days').format('YYYY-MM-DD')
      }
    }
  },
  {
    title: 'Internal deadline urgent',
    licenceNumber: 'INTDL-URG',
    data: {
      internalDeadline: {
        standard: dayJs().addWorkingTime(5, 'days').format('YYYY-MM-DD'),
        extended: dayJs().addWorkingTime(20, 'days').format('YYYY-MM-DD')
      }
    },
    date: dayJs().subtractWorkingTime(STANDARD_DEADLINE - 5, 'days').format('YYYY-MM-DD')
  },
  {
    title: 'Internal deadline past',
    licenceNumber: 'INTDL-PAST',
    data: {
      internalDeadline: {
        standard: dayJs().subtractWorkingTime(2, 'days').format('YYYY-MM-DD'),
        extended: dayJs().subtractWorkingTime(2, 'days').format('YYYY-MM-DD')
      }
    },
    date: dayJs().subtractWorkingTime(STANDARD_DEADLINE + 2, 'days').format('YYYY-MM-DD')
  },
  {
    title: 'Internal deadline future, statutory deadline future (same date)',
    licenceNumber: 'INTDL-STAT-FUT',
    data: {
      internalDeadline: {
        standard: dayJs().addWorkingTime(STANDARD_DEADLINE, 'days').format('YYYY-MM-DD'),
        extended: dayJs().addWorkingTime(EXTENDED_DEADLINE, 'days').format('YYYY-MM-DD')
      },
      deadline: {
        standard: dayJs().addWorkingTime(STANDARD_DEADLINE, 'days').format('YYYY-MM-DD'),
        extended: dayJs().addWorkingTime(EXTENDED_DEADLINE, 'days').format('YYYY-MM-DD'),
        isExtended: false
      }
    }
  },
  {
    title: 'Internal deadline future, statutory deadline future (internal earlier)',
    licenceNumber: 'INTDL-EARLY-STAT',
    data: {
      internalDeadline: {
        standard: dayJs().addWorkingTime(RESUBMISSION_DEADLINE, 'days').format('YYYY-MM-DD'),
        extended: dayJs().addWorkingTime(RESUBMISSION_DEADLINE, 'days').format('YYYY-MM-DD')
      },
      deadline: {
        standard: dayJs().addWorkingTime(STANDARD_DEADLINE, 'days').format('YYYY-MM-DD'),
        extended: dayJs().addWorkingTime(EXTENDED_DEADLINE, 'days').format('YYYY-MM-DD'),
        isExtended: false
      }
    }
  },
  {
    title: 'Internal deadline past, statutory deadline future',
    licenceNumber: 'INTDL-PAST-STAT-FUT',
    data: {
      internalDeadline: {
        standard: dayJs().subtractWorkingTime(2, 'days').format('YYYY-MM-DD'),
        extended: dayJs().subtractWorkingTime(2, 'days').format('YYYY-MM-DD')
      },
      deadline: {
        standard: dayJs().addWorkingTime(STANDARD_DEADLINE, 'days').format('YYYY-MM-DD'),
        extended: dayJs().addWorkingTime(EXTENDED_DEADLINE, 'days').format('YYYY-MM-DD'),
        isExtended: false
      }
    },
    date: dayJs().subtractWorkingTime(RESUBMISSION_DEADLINE + 2, 'days').format('YYYY-MM-DD')
  },
  {
    title: 'Internal deadline past, statutory deadline past',
    licenceNumber: 'INTDL-PAST-STAT-PAST',
    data: {
      internalDeadline: {
        standard: dayJs().subtractWorkingTime(2, 'days').format('YYYY-MM-DD'),
        extended: dayJs().subtractWorkingTime(13, 'days').format('YYYY-MM-DD')
      },
      deadline: {
        standard: dayJs().subtractWorkingTime(2, 'days').format('YYYY-MM-DD'),
        extended: dayJs().addWorkingTime(13, 'days').format('YYYY-MM-DD'),
        isExtended: false
      }
    },
    date: dayJs().subtractWorkingTime(STANDARD_DEADLINE + 2, 'days').format('YYYY-MM-DD')
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
