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
