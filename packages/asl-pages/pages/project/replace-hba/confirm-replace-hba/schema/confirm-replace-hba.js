module.exports = () => {
  const schema = {
    'hbaReplacementReason': {
      meta: true,
      inputType: 'textarea',
      validate: ['required']
    },
    confirmHbaDeclaration: {
      inputType: 'checkboxGroup',
      validate: ['required'],
      options: [
        {
          label: 'I have the consent of the inspector who assessed this application',
          value: 'yes'
        }
      ]
    }

  };

  return schema;
};
