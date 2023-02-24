module.exports = {
  name: {
    inputType: 'inputText',
    validate: ['required']
  },
  corporateStatus: {
    inputType: 'radioGroup',
    options: [{
      value: 'corporate',
      label: 'Corporate',
      hint: 'A legal person is responsible. We will contact a representative about any problems.'
    }, {
      value: 'non-profit',
      label: 'Non-profit',
      hint: 'A natural person is responsible for this establishment'
    }],
    validate: ['required']
  }
};
