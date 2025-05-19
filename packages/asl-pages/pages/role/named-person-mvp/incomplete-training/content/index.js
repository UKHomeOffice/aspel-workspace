module.exports = {
  title: 'Mandatory training to be completed',
  fields: {
    incomplete: {
      label: `Which {{roleType}} training modules need to be completed`
    },
    completeDate: {
      label: 'Date all mandatory training will be completed'
    },
    delayReason: {
      label: 'Explain why there is a delay in completing theses modules'
    }
  },
  buttons: {
    submit: 'Save and continue',
    cancel: 'Cancel'
  },
  errors: {
    incomplete: {
      required: 'Select all NACWO training modules that need to be completed'
    },
    delayReason: {
      required: 'Enter a reason why there is a delay in completing these modules'
    },
    completeDate: {
      required: 'Enter the date when all mandatory training will be completed. It must include a year in four digit, month and day.',
      validDate: 'Date awarded must be a valid date',
      dateIsAfter: 'Date awarded must be in the future.'
    }
  }
};
