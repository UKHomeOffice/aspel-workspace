module.exports = {
  title: 'Send application',
  warning: 'Project licence applications need to be reviewed by an AWERB and endorsed by the primary establishment\'s PEL holder before a licence can be granted.',
  fields: {
    authority: {
      label: 'Does this application have the endorsement of your primary establishment\'s PEL holder?'
    },
    awerb: {
      label: 'Has this application been reviewed by the AWERB of each relevant establishment?'
    },
    ready: {
      label: 'Is this version of your application ready for an inspector to approve?'
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
    }
  },
  buttons: {
    submit: 'Submit PPL application'
  }
};
