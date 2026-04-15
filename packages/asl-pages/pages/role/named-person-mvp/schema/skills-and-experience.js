const e = require('express');
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
  } else if (normalizedRoleType === ROLE_TYPES.nvs) {
    return {
      experience: {
        inputType: 'textAreaWithWordCount',
        maxWordCount: 300,
        validate: ['lessThanOrEqualToMaxWordCount', 'required']
      }
    };
  } else if (normalizedRoleType === ROLE_TYPES.sqp) {
    return {
      experience: {
        inputType: 'textAreaWithWordCount',
        maxWordCount: 300,
        validate: ['lessThanOrEqualToMaxWordCount', 'required']
      }
    };
  } else if (normalizedRoleType === ROLE_TYPES.nio) {
    return {
      understanding: {
        inputType: 'textAreaWithWordCount',
        maxWordCount: 300,
        validate: ['lessThanOrEqualToMaxWordCount', 'required']
      },
      familiarity: {
        inputType: 'textAreaWithWordCount',
        maxWordCount: 300,
        validate: ['lessThanOrEqualToMaxWordCount', 'required']
      },
      experience: {
        inputType: 'textAreaWithWordCount',
        maxWordCount: 300,
        validate: ['lessThanOrEqualToMaxWordCount', 'required']
      },
      communication: {
        inputType: 'textAreaWithWordCount',
        maxWordCount: 300,
        validate: ['lessThanOrEqualToMaxWordCount', 'required']
      }
    };
  } else if (normalizedRoleType === ROLE_TYPES.ntco) {
    return {
      experience: {
        inputType: 'textAreaWithWordCount',
        maxWordCount: 300,
        validate: ['lessThanOrEqualToMaxWordCount', 'required']
      },
      communication: {
        inputType: 'textAreaWithWordCount',
        maxWordCount: 300,
        validate: ['lessThanOrEqualToMaxWordCount', 'required']
      }
    };
  } else if (normalizedRoleType === ROLE_TYPES.nprc) {
    return {
      experience: {
        inputType: 'textAreaWithWordCount',
        maxWordCount: 300,
        validate: ['lessThanOrEqualToMaxWordCount', 'required']
      }
    };
  } else if (normalizedRoleType === ROLE_TYPES.pelh) {
    return {
      experience: {
        inputType: 'textAreaWithWordCount',
        maxWordCount: 300,
        validate: ['lessThanOrEqualToMaxWordCount', 'required']
      }
    };
  }
};
