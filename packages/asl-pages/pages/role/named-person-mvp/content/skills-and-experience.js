const { merge } = require('lodash');
const baseContent = require('../../../profile/content');
const { ROLE_TYPES } = require('../role-types');

module.exports = merge({}, baseContent, {
  title: {
    [ROLE_TYPES.pelh]: 'PEL holder skills and experience',
    default: '{{roleType}} skills and experience'
  },
  fields: {
    [ROLE_TYPES.nacwo]: {
      desc: 'Describe how {{profile.firstName}} demonstrates the following skills and experience:',
      experience: {
        label: 'Suitable expertise and training to minimise suffering and optimise the welfare of animals they are responsible for',
        hint: 'State if this is covered by mandatory training modules PILA, L, E1 and E2'
      },
      authority: {
        label: 'Appropriate personal and managerial authority to promote high standards',
        hint: 'For example, they are managing a service, area or team of animal technicians'
      },
      skills: {
        label: 'Good communication and diplomacy skills to champion a culture of care among both scientific and husbandry staff'
      }
    },
    [ROLE_TYPES.nvs]: {
      experience: {
        label: 'Describe how {{profile.firstName}} demonstrates expertise in the health and welfare of the species they will be responsible for'
      }
    },
    [ROLE_TYPES.sqp]: {
      experience: {
        label: 'Describe how {{profile.firstName}} demonstrates proven expertise in the health and welfare of the species held and the procedures carried out at the establishment'
      }
    },
    [ROLE_TYPES.nio]: {
      desc: 'Describe how {{profile.firstName}} demonstrates the following skills and experience:',
      understanding: {
        label: 'A good understanding of legal and ethical aspects of use of animals for scientific purposes',
        hint: 'State if they have completed training modules L and E1'
      },
      familiarity: {
        label: 'Familiarity with the concept, principles and potential applications of the 3Rs',
        hint: 'State if they have completed training module E2'
      },
      experience: {
        label: 'Expertise in sourcing, retrieving and storing relevant information',
        hint: 'For example, in a previous librarian role'
      },
      communication: {
        label: 'Good communication and networking skills'
      }
    },
    [ROLE_TYPES.ntco]: {
      desc: 'Describe how {{profile.firstName}} demonstrates the following skills and experience:',
      experience: {
        label: 'Sufficient seniority to influence others and make decisions on training issues'
      },
      communication: {
        label: 'Good communication, management and organisational skills'
      }
    },
    [ROLE_TYPES.pelh]: {
      experience: {
        label: 'Describe why {{profile.firstName}} is suitable for the PEL holder role'
      }
    },
    default: {
      experience: {
        label: 'Describe why {{profile.firstName}} is suitable for the {{roleType}} role'
      }
    }
  },
  buttons: {
    submit: 'Save and continue',
    cancel: 'Cancel'
  },
  errors: {
    fields: {
      [ROLE_TYPES.nacwo]: {
        experience: {
          required: 'Describe how they demonstrate suitable expertise and training to minimise suffering and optimise the welfare of animals they are responsible for'
        },
        authority: {
          required: 'Describe how they demonstrate appropriate personal and managerial authority to promote high standards'
        },
        skills: {
          required: 'Describe how they demonstrate good communication and diplomacy skills to champion a culture of care among both scientific and husbandry staff'
        }
      },
      [ROLE_TYPES.nvs]: {
        experience: {
          required: 'Describe how they demonstrate expertise in the health and welfare of the species they will be responsible for'
        }
      },
      [ROLE_TYPES.sqp]: {
        experience: {
          required: 'Describe how they demonstrate proven expertise in the health and welfare of the species held and the procedures carried out at the establishment'
        }
      },
      [ROLE_TYPES.nio]: {
        understanding: {
          required: 'Describe how they demonstrate a good understanding of legal and ethical aspects of use of animals for scientific purposes'
        },
        familiarity: {
          required: 'Describe how they demonstrate familiarity with the concept, principles and potential applications of the 3Rs'
        },
        experience: {
          required: 'Describe how they demonstrate expertise in sourcing, retrieving and storing relevant information'
        },
        communication: {
          required: 'Describe how they demonstrate good communication and networking skills'
        }
      },
      [ROLE_TYPES.ntco]: {
        experience: {
          required: 'Describe how they demonstrate sufficient seniority to influence others and make decisions on training issues'
        },
        communication: {
          required: 'Describe how they demonstrate good communication, management and organisational skills'
        }
      },
      [ROLE_TYPES.pelh]: {
        experience: {
          required: 'Describe why they are suitable for the PEL holder role'
        }
      },
      default: {
        experience: {
          required: 'Describe why they are suitable for the {{roleType}} role'
        }
      }
    }
  }
});
