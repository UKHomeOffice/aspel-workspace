const { merge } = require('lodash');
const baseContent = require('../../common/content');

module.exports = merge({}, baseContent, {
  page: {
    title: 'Staff workload and performance',
    subtitle: 'Animals in Science Regulation Unit',
    description: 'Check individual staff workloads and monitor the rate of completed tasks.'
  },
  tabs: {
    open: 'Outstanding and in progress tasks',
    returned: 'Returned tasks',
    closed: 'Completed tasks'
  },
  filters: {
    withAsru: {
      yes: 'Tasks with ASRU',
      no: 'Tasks with establishments'
    },
    role: {
      inspector: {
        open: 'Tasks with inspectors',
        returned: 'Tasks returned by inspectors',
        closed: 'Tasks closed by inspectors'
      },
      licensing: {
        open: 'Tasks with licensing officers',
        returned: 'Tasks returned by licensing officers',
        closed: 'Tasks closed by licensing officers'
      }
    }
  },
  fields: {
    assignedTo: {
      label: 'Staff member'
    },
    pplApplications: {
      label: 'Number of PPL applications'
    },
    pplAmendments: {
      label: 'Number of PPL amendments'
    },
    pils: {
      label: 'Number of PILs'
    },
    pels: {
      label: 'Number of PELs'
    },
    profiles: {
      label: 'Number of Profiles'
    },
    total: {
      label: 'Total'
    }
  },
  buttons: {
    submit: 'Update'
  }
});
