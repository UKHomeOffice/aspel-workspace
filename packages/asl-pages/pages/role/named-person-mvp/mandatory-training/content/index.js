module.exports = {
  title: '{{ roleType }} mandatory training',
  nacwoTrainingDesc: `\
Nominees must have completed all the mandatory training in the last 5 years before starting the role, unless:

* there is an unavoidable delay, in which case they must complete any missing modules as soon as possible
* they have grounds for an exemption - which means they have equivalent training or professional experience which makes the training unnecessary
`,
  nvsTrainingDesc: `\
Nominees must have completed all the mandatory training in the last 5 years before starting the role, unless they have grounds for exemption. This means they have equivalent training or professional experience which makes the training unnecessary.
`,
  nvsException: `The only exception is the NVS module, where if they haven'nt completed it in the last 5 years, they must do so withion 12 months of starting the role.`,
  mandatoryTrainingRequirements:
    '{{ roleType }} mandatory training requirements (opens below)',
  checkTrainingRecord: `Check {{profile.firstName}} training record (opens below)`,
  supportingGuidanceTitle: 'Supporting guidance on GOV.UK',
  fields: {
    mandatory: {
      label: `Has {{profile.firstName}} completed all the mandatory training?`
    }
  },
  buttons: {
    submit: 'Save and continue',
    cancel: 'Cancel'
  },
  errors: {
    type: {
      required: `Tell us if {{profile.firstName}}'s training record is accurate and up to date`
    }
  }
};
