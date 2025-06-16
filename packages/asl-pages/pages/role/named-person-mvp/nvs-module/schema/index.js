module.exports = () => {

  return {
    delayReason: {
      inputType: 'textarea',
      validate: [
        'required'
      ]
    },
    completeDate: {
      inputType: 'inputDate',
      hint: 'For example, 27 3 2007',
      nullValue: '',
      validate: [
        'required',
        'validDate',
        { dateIsAfter: 'now' }
      ]
    }
  };
};
