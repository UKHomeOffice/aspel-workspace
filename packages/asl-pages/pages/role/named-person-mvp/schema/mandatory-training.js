
const { MANDATORY_TRAINING_HINT_ROLE_TYPES, ROLE_TYPES, normalizeRoleType } = require('../role-types');

module.exports = (role) => {
  const getDelayLabel = (roleType) => {
    const labels = {
      [ROLE_TYPES.nacwo]: 'There is an unavoidable delay in completing one or more modules',
      [ROLE_TYPES.nvs]: 'They have not yet completed the NVS module'
    };

    if (!labels[roleType]) {
      throw new Error(`Unknown role type: ${roleType}`);
    }

    return labels[roleType];
  };

  const mandatoryOptions = (roleType) => {
    if (roleType === ROLE_TYPES.sqp) {
      return [
        {
          label: 'Yes',
          value: 'yes',
          behaviour: 'exclusive'
        },
        {
          label: 'No, they have requested an exemption from one or more modules',
          value: 'exemption'
        }
      ];
    }

    return [
      {
        label: 'Yes',
        value: 'yes',
        behaviour: 'exclusive'
      },
      {
        id: 'divider',
        divider: 'Or select each that applies:',
        className: 'govuk-checkboxes__divider govuk-checkboxes__divider-wide'
      },
      {
        label: 'They have requested an exemption from one or more modules',
        value: 'exemption'
      },
      {
        label: getDelayLabel(roleType),
        value: 'delay',
        hint:
          roleType === ROLE_TYPES.nvs
            ? 'They will complete it within 12 months of starting the role.'
            : null
      }
    ];
  };

  const roleType = normalizeRoleType(role.type);

  return {
    mandatory: {
      inputType: 'checkboxGroup',
      options: mandatoryOptions(roleType),
      validate: ['required', 'exclusive'],
      hint: MANDATORY_TRAINING_HINT_ROLE_TYPES.includes(roleType)
        ? 'Select \'Yes\' if they have completed all the mandatory training within the last 5 years.'
        : null
    }
  };
};
