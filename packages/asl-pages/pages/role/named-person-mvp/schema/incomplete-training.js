const { ROLE_TYPES, normalizeRoleType } = require('../role-types');

module.exports = (rawRoleType) => {
  const roleType = normalizeRoleType(rawRoleType);

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
      value: 'PILA (theory)'
    },
    {
      value: 'PILA (skills)'
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
      // Copy deck rows 4 (NACWO) and 11 (NVS): both play the date back as
      // "Completion date" ("Completion date must be a real date"), but the
      // "no date entered" message names what is being completed, so it differs
      // by role. The rest come from the generic GDS templates.
      dateLabel: 'Completion date',
      dateEnter: roleType === ROLE_TYPES.nvs
        ? 'Enter a date when the module will be completed'
        : 'Enter a date when all mandatory training will be completed',
      hint: 'For example, 27 3 2007',
      nullValue: '',
      validate: [
        'required',
        'validDate',
        { dateIsAfter: 'now' }
      ]
    }
  };

  if (roleType === ROLE_TYPES.nacwo) {
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
