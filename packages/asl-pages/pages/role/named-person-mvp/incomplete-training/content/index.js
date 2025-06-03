module.exports = {
  title: 'Mandatory training to be completed',
  fields: {
    incomplete: {
      label: `Which {{roleType}} training modules need to be completed?`
    },
    completeDate: {
      label: 'Date all mandatory training will be completed'
    },
    delayReason: {
      label: 'Explain why there is a delay in completing these modules'
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
      required: 'The date must be a real date and include a day, month and year. The year must include 4 numbers',
      validDate: 'The date must be a real date and include a day, month and year. The year must include 4 numbers',
      dateIsAfter: 'The date must be in the future'
    }
  }
};
