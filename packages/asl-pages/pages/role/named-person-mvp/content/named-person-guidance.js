const { ROLE_TYPES, normalizeRoleType } = require('../role-types');

const LABELS = {
  conflictOfInterest: 'Make a conflict of interest declaration',
  cpd: 'Guidance on training and continuous professional development (CPD) under ASPA',
  operation: 'Guidance on the operation of the Animals (Scientific Procedures) Act 1986'
};

const URLS = {
  conflictOfInterest: 'https://www.gov.uk/government/publications/conflict-of-interest-declaration-form-aspa-1986',
  mandatoryTrainingGuidance: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act',
  roleGuide: {
    [ROLE_TYPES.nacwo]: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-animal-care-and-welfare-officer-role',
    [ROLE_TYPES.nvs]: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-veterinary-surgeon-role',
    [ROLE_TYPES.sqp]: 'https://www.gov.uk/guidance/nominate-someone-for-a-suitably-qualified-person-role',
    [ROLE_TYPES.nio]: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-information-officer-role',
    [ROLE_TYPES.ntco]: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-training-and-competency-officer-role'
  },
  cpd: {
    [ROLE_TYPES.nacwo]: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#named-animal-care-and-welfare-officers-nacwos',
    [ROLE_TYPES.nvs]: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#named-veterinary-surgeons-nvss',
    [ROLE_TYPES.sqp]: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#other-suitably-qualified-persons-sqp',
    [ROLE_TYPES.nio]: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#named-information-officers-nios',
    [ROLE_TYPES.ntco]: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#named-training-and-competency-officers-ntcos',
    establishmentRoles: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#establishment-licence-holdernamed-person-responsible-for-compliance'
  },
  operation: {
    [ROLE_TYPES.nacwo]: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#named-animal-care-and-welfare-officer-nacwo',
    [ROLE_TYPES.nvs]: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#named-veterinary-surgeon-nvs',
    [ROLE_TYPES.sqp]: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#other-suitably-qualified-person',
    [ROLE_TYPES.nio]: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#named-information-officer-nio',
    [ROLE_TYPES.ntco]: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#named-training-and-competency-officer-ntco',
    [ROLE_TYPES.nprc]: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#named-person-responsible-for-compliance-nprc',
    licenceHolder: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#who-can-hold-an-establishment-licence'
  }
};

const link = (href, label) => ({ href, label });

const namedPersonGuidanceByRole = {
  [ROLE_TYPES.nacwo]: {
    roleGuideUrl: URLS.roleGuide[ROLE_TYPES.nacwo],
    roleGuideLabels: {
      beforeYouApply: 'NACWO role guide',
      mandatoryTraining: 'NACWO role guide'
    },
    supportingLinks: {
      beforeYouApply: [
        link(URLS.roleGuide[ROLE_TYPES.nacwo], 'NACWO role guide'),
        link(URLS.conflictOfInterest, LABELS.conflictOfInterest),
        link(URLS.cpd[ROLE_TYPES.nacwo], LABELS.cpd),
        link(URLS.operation[ROLE_TYPES.nacwo], LABELS.operation)
      ],
      mandatoryTraining: [
        link(URLS.roleGuide[ROLE_TYPES.nacwo], 'NACWO role guide'),
        link(URLS.cpd[ROLE_TYPES.nacwo], LABELS.cpd)
      ]
    }
  },
  [ROLE_TYPES.nvs]: {
    roleGuideUrl: URLS.roleGuide[ROLE_TYPES.nvs],
    roleGuideLabels: {
      beforeYouApply: 'NVS role guide',
      mandatoryTraining: 'NVS role guide'
    },
    supportingLinks: {
      beforeYouApply: [
        link(URLS.roleGuide[ROLE_TYPES.nvs], 'NVS role guide'),
        link(URLS.conflictOfInterest, LABELS.conflictOfInterest),
        link(URLS.cpd[ROLE_TYPES.nvs], LABELS.cpd),
        link(URLS.operation[ROLE_TYPES.nvs], LABELS.operation)
      ],
      mandatoryTraining: [
        link(URLS.roleGuide[ROLE_TYPES.nvs], 'NVS role guide'),
        link(URLS.cpd[ROLE_TYPES.nvs], LABELS.cpd)
      ]
    }
  },
  [ROLE_TYPES.sqp]: {
    roleGuideUrl: URLS.roleGuide[ROLE_TYPES.sqp],
    roleGuideLabels: {
      beforeYouApply: 'SQP role guide',
      mandatoryTraining: 'SQP role guide'
    },
    supportingLinks: {
      beforeYouApply: [
        link(URLS.roleGuide[ROLE_TYPES.sqp], 'SQP role guide'),
        link(URLS.conflictOfInterest, LABELS.conflictOfInterest),
        link(URLS.operation[ROLE_TYPES.sqp], LABELS.operation)
      ],
      mandatoryTraining: [
        link(URLS.roleGuide[ROLE_TYPES.sqp], 'SQP role guide'),
        link(URLS.cpd[ROLE_TYPES.sqp], LABELS.cpd)
      ]
    }
  },
  [ROLE_TYPES.nio]: {
    roleGuideUrl: URLS.roleGuide[ROLE_TYPES.nio],
    roleGuideLabels: {
      beforeYouApply: 'NIO role guide'
    },
    supportingLinks: {
      beforeYouApply: [
        link(URLS.roleGuide[ROLE_TYPES.nio], 'NIO role guide'),
        link(URLS.cpd[ROLE_TYPES.nio], LABELS.cpd),
        link(URLS.operation[ROLE_TYPES.nio], LABELS.operation)
      ]
    }
  },
  [ROLE_TYPES.ntco]: {
    roleGuideUrl: URLS.roleGuide[ROLE_TYPES.ntco],
    roleGuideLabels: {
      beforeYouApply: 'NTCO role guide'
    },
    supportingLinks: {
      beforeYouApply: [
        link(URLS.roleGuide[ROLE_TYPES.ntco], 'NTCO role guide'),
        link(URLS.cpd[ROLE_TYPES.ntco], LABELS.cpd),
        link(URLS.operation[ROLE_TYPES.ntco], LABELS.operation)
      ]
    }
  },
  [ROLE_TYPES.nprc]: {
    supportingLinks: {
      beforeYouApply: [
        link(URLS.conflictOfInterest, LABELS.conflictOfInterest),
        link(URLS.cpd.establishmentRoles, LABELS.cpd),
        link(URLS.operation[ROLE_TYPES.nprc], LABELS.operation)
      ]
    }
  },
  [ROLE_TYPES.pelh]: {
    supportingLinks: {
      beforeYouApply: [
        link(URLS.conflictOfInterest, LABELS.conflictOfInterest),
        link(URLS.cpd.establishmentRoles, LABELS.cpd),
        link(URLS.operation.licenceHolder, LABELS.operation)
      ]
    }
  },
  [ROLE_TYPES.holc]: {
    supportingLinks: {
      beforeYouApply: [
        link(URLS.conflictOfInterest, LABELS.conflictOfInterest),
        link(URLS.cpd.establishmentRoles, LABELS.cpd),
        link(URLS.operation.licenceHolder, LABELS.operation)
      ]
    }
  }
};

const getNamedPersonGuidance = roleType => namedPersonGuidanceByRole[normalizeRoleType(roleType)];

const getBeforeYouApplyRoleGuide = roleType => {
  const guidance = getNamedPersonGuidance(roleType);

  if (!guidance?.roleGuideUrl || !guidance?.roleGuideLabels?.beforeYouApply) {
    return {};
  }

  return {
    roleGuideLabel: guidance.roleGuideLabels.beforeYouApply,
    roleGuideUrl: guidance.roleGuideUrl
  };
};

const getBeforeYouApplySupportingLinks = roleType => {
  const guidance = getNamedPersonGuidance(roleType);
  return guidance?.supportingLinks?.beforeYouApply || [];
};

const getMandatoryTrainingSupportingLinks = roleType => {
  const guidance = getNamedPersonGuidance(roleType);
  return guidance?.supportingLinks?.mandatoryTraining || [];
};

module.exports = {
  namedPersonGuidanceByRole,
  getNamedPersonGuidance,
  getBeforeYouApplyRoleGuide,
  getBeforeYouApplySupportingLinks,
  getMandatoryTrainingSupportingLinks
};

module.exports.default = module.exports;
