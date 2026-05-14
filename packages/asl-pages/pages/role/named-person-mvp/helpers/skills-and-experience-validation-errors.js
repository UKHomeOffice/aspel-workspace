const { ROLE_TYPES, normalizeRoleType } = require('../role-types');

const roleFieldErrorMap = {
  [ROLE_TYPES.nacwo]: {
    experience: 'requiredNacwo'
  },
  [ROLE_TYPES.nio]: {
    experience: 'requiredNio'
  },
  [ROLE_TYPES.ntco]: {
    experience: 'requiredNtco',
    communication: 'requiredNtco'
  },
  [ROLE_TYPES.nvs]: {
    experience: 'requiredNvs'
  },
  [ROLE_TYPES.pelh]: {
    experience: 'requiredPelh'
  },
  [ROLE_TYPES.sqp]: {
    experience: 'requiredSqp'
  }
};

module.exports = (roleType, validationErrors = {}) => {
  const normalizedRoleType = normalizeRoleType(roleType);
  const fieldMap = roleFieldErrorMap[normalizedRoleType];

  if (!fieldMap) {
    return validationErrors;
  }

  const errors = { ...validationErrors };

  for (const [field, errorKey] of Object.entries(fieldMap)) {
    if (errors[field] === 'required') {
      errors[field] = errorKey;
    }
  }

  return errors;
};
