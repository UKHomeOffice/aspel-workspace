const { ROLE_TYPES, normalizeRoleType } = require('../role-types');

module.exports = (roleType) => {
  const normalizedRoleType = normalizeRoleType(roleType);

  if (normalizedRoleType === ROLE_TYPES.nacwo) {
    return {
      experience: {
        inputType: 'textAreaWithWordCount',
        maxWordCount: 300,
        hint: 'State if this is covered by mandatory training modules PILA, L, E1 and E2',
        validate: ['lessThanOrEqualToMaxWordCount', 'required']
      },
      authority: {
        inputType: 'textAreaWithWordCount',
        maxWordCount: 300,
        hint: 'For example, they are managing a service, area or team of animal technicians',
        validate: ['lessThanOrEqualToMaxWordCount', 'required']
      },
      skills: {
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
        hint: 'State if they have completed training modules L and E1',
        validate: ['lessThanOrEqualToMaxWordCount', 'required']
      },
      familiarity: {
        inputType: 'textAreaWithWordCount',
        maxWordCount: 300,
        hint: 'State if they have completed training module E2',
        validate: ['lessThanOrEqualToMaxWordCount', 'required']
      },
      experience: {
        inputType: 'textAreaWithWordCount',
        maxWordCount: 300,
        hint: 'For example, in a previous librarian role',
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
  } else if ([ROLE_TYPES.pelh, ROLE_TYPES.nprc, ROLE_TYPES.holc].includes(normalizedRoleType)) {
    return {
      experience: {
        inputType: 'textarea',
        validate: ['required']
      }
    };
  } else {
    return {
      experience: {
        inputType: 'textAreaWithWordCount',
        maxWordCount: 300,
        validate: ['lessThanOrEqualToMaxWordCount', 'required']
      }
    };
  }
};
