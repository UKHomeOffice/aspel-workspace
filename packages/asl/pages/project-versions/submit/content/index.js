module.exports = {
  title: 'Send {{model.type}}',
  warning: 'Project licence applications need to be reviewed by an AWERB and endorsed by the primary establishment\'s PEL holder before a licence can be granted.',
  fields: {
    authority: {
      label: 'Does this {{model.type}} have the endorsement of your primary establishment\'s PEL holder?'
    },
    awerb: {
      label: 'Has this application been reviewed by the AWERB of each relevant establishment?'
    },
    ready: {
      label: 'Is this version of your application ready for an inspector to approve?'
    },
    comment: {
      label: 'Why are you making this amendment?'
    }
  },
  errors: {
    authority: {
      required: 'Select an option'
    },
    awerb: {
      required: 'Select an option'
    },
    ready: {
      required: 'Select an option'
    },
    comment: {
      required: 'Please provide a reason'
    }
  },
  buttons: {
    submit: {
      application: 'Submit PPL application',
      amendment: 'Submit PPL amendment'
    }
  }
};
