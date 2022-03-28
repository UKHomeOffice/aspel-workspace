const { merge } = require('lodash');
const baseContent = require('./index');

module.exports = merge({}, baseContent, {
  fields: {
    flagStatus: {
      label: 'Select status for enforcement flag',
      options: {
        open: {
          label: 'Ongoing enforcement'
        },
        closed: {
          label: 'Closed enforcement - remedial action applied',
          hint: 'Flag will remain in place for 5 years'
        },
        'no-breach': {
          label: 'No breach',
          hint: 'Delete any remaining flags and remove subject from case'
        }
      }
    },
    flags: {
      label: 'Apply flags to',
      hint: 'Select all that apply',
      options: {
        profile: {
          label: baseContent.flag.appliedTo.profile.link,
          hint: baseContent.flag.appliedTo.profile.summary
        },
        pil: {
          label: baseContent.flag.appliedTo.pil.link,
          hint: baseContent.flag.appliedTo.pil.summary
        },
        project: {
          label: baseContent.flag.appliedTo.project.link,
          hint: baseContent.flag.appliedTo.project.summary
        }
      }
    },
    remedialAction: {
      label: 'Select remedial action taken',
      options: {
        'inspector-advice': {
          label: 'Inspector advice'
        },
        'letter-of-reprimand': {
          label: 'Letter of reprimand'
        },
        'reprimand-retraining': {
          label: 'Letter of reprimand and retraining'
        },
        'compliance-notice': {
          label: 'Compliance notice'
        },
        'suspension-retraining': {
          label: 'Suspension and retraining'
        },
        'licence-revocation': {
          label: 'Revocation of licence'
        },
        'other': {
          label: 'Other'
        }
      }
    }
  }
});
