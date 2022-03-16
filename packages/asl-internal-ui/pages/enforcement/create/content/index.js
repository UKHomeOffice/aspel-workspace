module.exports = {
  page: {
    title: 'Add case details'
  },
  fields: {
    caseNumber: {
      label: 'Enter case number'
    }
  },
  buttons: {
    submit: 'Continue'
  },
  errors: {
    caseNumber: {
      required: 'Please enter the enforcement case number',
      notUnique: 'This case number already exists'
    }
  },
  notifications: {
    success: 'A new enforcement case has been created'
  }
};
