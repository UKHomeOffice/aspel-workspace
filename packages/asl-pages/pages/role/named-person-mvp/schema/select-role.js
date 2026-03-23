const namedRoles = require('../content/named-roles');
const hintText = require('../../content/hint-text');
const { EXCLUDED_ROLE_TYPES_BY_CORPORATE_STATUS, ROLE_TYPES } = require('../role-types');

module.exports = (roles, establishment) => {
  const excludeRoles =
    (establishment.corporateStatus &&
      EXCLUDED_ROLE_TYPES_BY_CORPORATE_STATUS[establishment.corporateStatus]) ||
    [];
  roles = Object.keys(namedRoles)
    .filter((r) => !roles.includes(r))
    .filter((r) => !excludeRoles.includes(r));

  const options = roles.map((role) => {
    return {
      value: role,
      label: namedRoles[role],
      hint: hintText[role],
      reveal:
        role === ROLE_TYPES.nvs
          ? { rcvsNumber: { inputType: 'inputText', validate: ['required'] } }
          : null
    };
  });

  return {
    type: {
      inputType: 'radioGroup',
      automapReveals: true,
      validate: [
        'required',
        {
          definedValues: roles
        }
      ],
      options,
      nullValue: [],
      labelAsLegend: true
    }
  };
};
