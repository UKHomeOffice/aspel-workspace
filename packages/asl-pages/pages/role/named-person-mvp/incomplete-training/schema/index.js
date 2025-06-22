module.exports = (roleType) => {

  const roles = () => [
    {
      label: 'L',
      value: 'L'
    },
    {
      label: 'E1',
      value: 'E1'
    },
    {
      label: `PILA (theory) - Species specific`,
      value: 'PILA (theory)'
    },
    {
      label: 'PILA (skills) - Species specific',
      value: 'PILA (skills)',
      tag: 'Species specific'
    },
    {
      label: 'PILB',
      value: 'PILB'
    },
    {
      label: 'PILC',
      value: 'PILC'
    },
    {
      label: 'K (theory)',
      value: 'K (theory)'
    },
    {
      label: 'E2',
      value: 'E2'
    },
    {
      label: 'NACWO',
      value: 'NACWO'
    }
  ];

  let payload = {
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

  if (roleType === 'nacwo') {
    return {
      incomplete: {
        hint: 'Select all that apply.',
        inputType: 'checkboxGroup',
        options: roles(),
        validate: ['required', 'exclusive']
      },
      ...payload
    };
  }

  return payload;
};
