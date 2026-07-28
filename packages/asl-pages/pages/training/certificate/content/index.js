module.exports = {
  title: 'What are the certificate details?',
  hint: 'You do not need to send certificates or copies to ASRU.',
  fields: {
    certificateNumber: {
      label: 'Certificate number'
    },
    accreditingBody: {
      label: 'Accrediting body or course provider'
    },
    passDate: {
      label: 'Date awarded',
      // Noun-phrase used in the GDS date error messages (e.g. "Award date must
      // include a month"). See errors.default.date.* in common content.
      dateLabel: 'Award date',
      hint: `This should be within the last 5 years

For example, 30 09 2020`
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
      // The rest of the date messages (incomplete / real date / past) come from
      // the generic GDS templates using dateLabel; only "enter" is bespoke here.
      date: {
        enter: 'Enter the date the certificate was awarded'
      }
    },
    otherAccreditingBody: {
      required: 'Please specify which accrediting body'
    }
  },
  buttons: {
    submit: 'Continue'
  }
};
