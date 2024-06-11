module.exports = {
  name: {
    inputType: 'inputText',
    validate: ['required']
  },
  corporateStatus: {
    inputType: 'radioGroup',
    options: [{
      value: 'corporate',
      label: 'Corporate PEL',
      hint: 'A legal person is responsible. We will contact a representative about any problems.'
    }, {
      value: 'non-profit',
      label: 'Individual PEL',
      hint: 'A natural person is responsible for this establishment'
    }],
    validate: ['required']
  }
};
