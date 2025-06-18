module.exports = {
  title: 'NVS module details',
  fields: {
    completeDate: {
      label: 'Date the module will be completed'
    },
    delayReason: {
      label: 'Explain why the module is not yet completed'
    }
  },
  buttons: {
    submit: 'Save and continue',
    cancel: 'Cancel'
  },
  errors: {
    delayReason: {
      required: 'Enter a reason why the module is not yet completed'
    },
    completeDate: {
      required: 'The date must be a real date and include a day, month and year. The year must include 4 numbers',
      validDate: 'The date must be a real date and include a day, month and year. The year must include 4 numbers',
      dateIsAfter: 'The date must be in the future'
    }
  }
};
