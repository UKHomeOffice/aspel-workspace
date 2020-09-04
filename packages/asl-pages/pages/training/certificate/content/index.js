module.exports = {
  title: 'What are the certificate details?',
  fields: {
    certificateNumber: {
      label: 'Certificate number'
    },
    accreditingBody: {
      label: 'Accrediting body or course provider'
    },
    passDate: {
      label: 'Date awarded',
      hint: 'For example, 12 11 2007'
    }
  },
  errors: {
    certificateNumber: {
      required: 'You need to enter a certificate number'
    },
    accreditingBody: {
      required: 'You need to choose an accrediting body or course provider'
    },
    passDate: {
      required: 'You need to enter the date when the certificate was awarded.',
      validDate: 'Date awarded must be a valid date',
      dateIsBefore: 'Date awarded must be in the past.'
    },
    otherAccreditingBody: {
      required: 'Please specify which accrediting body'
    }
  },
  buttons: {
    submit: 'Continue'
  }
};
