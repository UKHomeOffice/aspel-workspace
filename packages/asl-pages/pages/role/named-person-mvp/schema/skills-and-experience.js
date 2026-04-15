const { ROLE_TYPES, normalizeRoleType } = require('../role-types');

module.exports = (roleType) => {
  const normalizedRoleType = normalizeRoleType(roleType);

  if (normalizedRoleType === ROLE_TYPES.nacwo) {
    return {
      experience: {
        inputType: 'textAreaWithWordCount',
        maxWordCount: 300,
        validate: ['lessThanOrEqualToMaxWordCount', 'required']
      },
      authority: {
        inputType: 'textAreaWithWordCount',
        maxWordCount: 300,
        validate: ['lessThanOrEqualToMaxWordCount', 'required']
      },
      skills: {
        inputType: 'textAreaWithWordCount',
        maxWordCount: 300,
        validate: ['lessThanOrEqualToMaxWordCount', 'required']
      }
    };
  }

  if (normalizedRoleType === ROLE_TYPES.nvs) {
    return {
      experience: {
        inputType: 'textAreaWithWordCount',
        maxWordCount: 300,
        validate: ['lessThanOrEqualToMaxWordCount', 'required']
      }
    };
  }

  return {};
};
