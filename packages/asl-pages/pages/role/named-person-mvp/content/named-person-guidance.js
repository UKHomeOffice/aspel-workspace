const LABELS = {
  conflictOfInterest: 'Make a conflict of interest declaration',
  cpd: 'Guidance on training and continuous professional development (CPD) under ASPA',
  operation: 'Guidance on the operation of the Animals (Scientific Procedures) Act 1986'
};

const URLS = {
  conflictOfInterest: 'https://www.gov.uk/government/publications/conflict-of-interest-declaration-form-aspa-1986',
  mandatoryTrainingGuidance: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act',
  roleGuide: {
    nacwo: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-animal-care-and-welfare-officer-role',
    nvs: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-veterinary-surgeon-role',
    sqp: 'https://www.gov.uk/guidance/nominate-someone-for-a-suitably-qualified-person-role',
    nio: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-information-officer-role',
    ntco: 'https://www.gov.uk/guidance/nominate-someone-for-a-named-training-and-competency-officer-role'
  },
  cpd: {
    nacwo: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#named-animal-care-and-welfare-officers-nacwos',
    nvs: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#named-veterinary-surgeons-nvs',
    nio: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#named-information-officers-nios',
    ntco: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#named-training-and-competency-officers-ntcos',
    establishmentRoles: 'https://www.gov.uk/government/publications/training-and-development-under-the-animals-scientific-procedures-act/guidance-for-training-and-continuous-professional-development-under-the-animals-scientific-procedures-act-1986-accessible#establishment-licence-holdernamed-person-responsible-for-compliance'
  },
  operation: {
    nacwo: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#named-animal-care-and-welfare-officer-nacwo',
    nvs: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#named-veterinary-surgeon-nvs',
    sqp: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#other-suitably-qualified-person',
    nio: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#named-information-officer-nio',
    ntco: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#named-training-and-competency-officer-ntco',
    nprc: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#named-person-responsible-for-compliance-nprc',
    licenceHolder: 'https://www.gov.uk/government/publications/the-operation-of-the-animals-scientific-procedures-act-1986/the-operation-of-the-animals-scientific-procedures-act-1986-aspa-accessible#who-can-hold-an-establishment-licence'
  }
};

const link = (href, label) => ({ href, label });

const namedPersonGuidanceByRole = {
  nacwo: {
    roleGuideUrl: URLS.roleGuide.nacwo,
    roleGuideLabels: {
      beforeYouApply: 'NACWO role guide',
      mandatoryTraining: 'Adding a NACWO role'
    },
    supportingLinks: {
      beforeYouApply: [
        link(URLS.roleGuide.nacwo, 'NACWO role guide'),
        link(URLS.conflictOfInterest, LABELS.conflictOfInterest),
        link(URLS.cpd.nacwo, LABELS.cpd),
        link(URLS.operation.nacwo, LABELS.operation)
      ],
      mandatoryTraining: [
        link(URLS.roleGuide.nacwo, 'Adding a NACWO role'),
        link(URLS.mandatoryTrainingGuidance, LABELS.cpd)
      ]
    }
  },
  nvs: {
    roleGuideUrl: URLS.roleGuide.nvs,
    roleGuideLabels: {
      beforeYouApply: 'NVS role guide',
      mandatoryTraining: 'Adding a NVS role'
    },
    supportingLinks: {
      beforeYouApply: [
        link(URLS.roleGuide.nvs, 'NVS role guide'),
        link(URLS.conflictOfInterest, LABELS.conflictOfInterest),
        link(URLS.cpd.nvs, LABELS.cpd),
        link(URLS.operation.nvs, LABELS.operation)
      ],
      mandatoryTraining: [
        link(URLS.roleGuide.nvs, 'Adding a NVS role'),
        link(URLS.mandatoryTrainingGuidance, LABELS.cpd)
      ]
    }
  },
  sqp: {
    roleGuideUrl: URLS.roleGuide.sqp,
    roleGuideLabels: {
      beforeYouApply: 'SQP role guide',
      mandatoryTraining: 'Adding a SQP role'
    },
    supportingLinks: {
      beforeYouApply: [
        link(URLS.roleGuide.sqp, 'SQP role guide'),
        link(URLS.conflictOfInterest, LABELS.conflictOfInterest),
        link(URLS.operation.sqp, LABELS.operation)
      ],
      mandatoryTraining: [
        link(URLS.roleGuide.sqp, 'Adding a SQP role'),
        link(URLS.operation.sqp, LABELS.operation)
      ]
    }
  },
  nio: {
    roleGuideUrl: URLS.roleGuide.nio,
    roleGuideLabels: {
      beforeYouApply: 'NIO role guide'
    },
    supportingLinks: {
      beforeYouApply: [
        link(URLS.roleGuide.nio, 'NIO role guide'),
        link(URLS.cpd.nio, LABELS.cpd),
        link(URLS.operation.nio, LABELS.operation)
      ]
    }
  },
  ntco: {
    roleGuideUrl: URLS.roleGuide.ntco,
    roleGuideLabels: {
      beforeYouApply: 'NTCO role guide'
    },
    supportingLinks: {
      beforeYouApply: [
        link(URLS.roleGuide.ntco, 'NTCO role guide'),
        link(URLS.cpd.ntco, LABELS.cpd),
        link(URLS.operation.ntco, LABELS.operation)
      ]
    }
  },
  nprc: {
    supportingLinks: {
      beforeYouApply: [
        link(URLS.conflictOfInterest, LABELS.conflictOfInterest),
        link(URLS.cpd.establishmentRoles, LABELS.cpd),
        link(URLS.operation.nprc, LABELS.operation)
      ]
    }
  },
  pelh: {
    supportingLinks: {
      beforeYouApply: [
        link(URLS.conflictOfInterest, LABELS.conflictOfInterest),
        link(URLS.cpd.establishmentRoles, LABELS.cpd),
        link(URLS.operation.licenceHolder, LABELS.operation)
      ]
    }
  },
  holc: {
    supportingLinks: {
      beforeYouApply: [
        link(URLS.conflictOfInterest, LABELS.conflictOfInterest),
        link(URLS.cpd.establishmentRoles, LABELS.cpd),
        link(URLS.operation.licenceHolder, LABELS.operation)
      ]
    }
  }
};

const getNamedPersonGuidance = roleType => namedPersonGuidanceByRole[(roleType || '').toLowerCase()];

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
