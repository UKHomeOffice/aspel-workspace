module.exports = {
  title: {
    inputType: 'inputText',
    validate: 'required'
  },
  licenceNumber: {
    inputType: 'inputText',
    validate: 'required'
  },
  issueDate: {
    inputType: 'inputDate',
    // Used by the GDS validDate messages; required/dateIsBefore keep their bespoke
    // content (see content/index.js) so their e2e-asserted wording is unchanged.
    dateLabel: 'Granted date',
    validate: [
      'required',
      'validDate',
      {'dateIsBefore': 'now'}
    ]
  },
  duration: {
    inputType: 'inputDuration',
    validate: 'required'
  }
};
