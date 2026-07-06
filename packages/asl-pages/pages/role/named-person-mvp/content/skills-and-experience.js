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
      desc: 'Describe how {{profile.firstName}} demonstrates skills and experience in the following areas:',
      experience: {
        label: 'Suitable expertise and training to minimise suffering and optimise the welfare of animals they are responsible for'
      },
      authority: {
        label: 'Appropriate personal and managerial authority to promote high standards'
      },
      skills: {
        label: 'Good communication and diplomacy skills to champion a culture of care among both scientific and husbandry staff'
      }
    },
    [ROLE_TYPES.nvs]: {
      desc: 'Describe how {{profile.firstName}} demonstrates skills and experience in the following areas:',
      experience: {
        label: 'Describe how {{profile.firstName}} demonstrates expertise in the health and welfare of the species they will be responsible for'
      }
    },
    [ROLE_TYPES.sqp]: {
      desc: 'Describe how {{profile.firstName}} demonstrates skills and experience in the following areas:',
      experience: {
        label: 'Describe how {{profile.firstName}} demonstrates proven expertise in the health and welfare of the species held and the procedures carried out at the establishment'
      }
    },
    [ROLE_TYPES.nio]: {
      desc: 'Describe how {{profile.firstName}} demonstrates skills and experience in the following areas:',
      understanding: {
        label: 'A good understanding of legal and ethical aspects of use of animals for scientific purposes'
      },
      familiarity: {
        label: 'Familiarity with the concept, principles and potential applications of the 3Rs'
      },
      experience: {
        label: 'Expertise in sourcing, retrieving and storing relevant information'
      },
      communication: {
        label: 'Good communication and networking skills'
      }
    },
    [ROLE_TYPES.ntco]: {
      desc: 'Describe how {{profile.firstName}} demonstrates skills and experience in the following areas:',
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
    [ROLE_TYPES.nprc]: {
      experience: {
        label: 'Describe why {{profile.firstName}} is suitable for the NPRC role'
      }
    },
    [ROLE_TYPES.holc]: {
      experience: {
        label: 'Describe why {{profile.firstName}} is suitable for the HOLC role'
      }
    },
    default: {
      experience: {
        label: 'Describe why {{profile.firstName}} is suitable for the {{roleType}} role'
      }
    }
  },
  buttons: {
    submit: 'Continue',
    cancel: 'Cancel'
  },
  errors: {
    experience: {
      required: 'Describe why they are suitable for the {{roleType}} role',
      requiredPelh: 'Describe why they are suitable for the PEL holder role',
      requiredNacwo: 'Describe how they demonstrate suitable expertise and training to minimise suffering and optimise the welfare of animals they are responsible for',
      requiredNtco: 'Describe how they demonstrate sufficient seniority to influence others and make decisions on training issues',
      requiredNio: 'Describe how they demonstrate expertise in sourcing, retrieving and storing relevant information',
      requiredNvs: 'Describe how they demonstrate expertise in the health and welfare of the species they will be responsible for',
      requiredSqp: 'Describe how they demonstrate proven expertise in the health and welfare of the species held and the procedures carried out at the establishment',
      lessThanOrEqualToMaxWordCount: 'Your description must be 300 words or less'
    },
    authority: {
      required: 'Describe how they demonstrate appropriate personal and managerial authority to promote high standards',
      lessThanOrEqualToMaxWordCount: 'Your description must be 300 words or less'
    },
    skills: {
      required: 'Describe how they demonstrate good communication and diplomacy skills to champion a culture of care among both scientific and husbandry staff',
      lessThanOrEqualToMaxWordCount: 'Your description must be 300 words or less'
    },
    understanding: {
      required: 'Describe how they demonstrate a good understanding of legal and ethical aspects of use of animals for scientific purposes',
      lessThanOrEqualToMaxWordCount: 'Your description must be 300 words or less'
    },
    familiarity: {
      required: 'Describe how they demonstrate familiarity with the concept, principles and potential applications of the 3Rs',
      lessThanOrEqualToMaxWordCount: 'Your description must be 300 words or less'
    },
    communication: {
      required: 'Describe how they demonstrate good communication and networking skills',
      requiredNtco: 'Describe how they demonstrate good communication, management and organisational skills',
      lessThanOrEqualToMaxWordCount: 'Your description must be 300 words or less'
    },
    default: {
      required: 'This is a required field',
      lessThanOrEqualToMaxWordCount: 'Your description must be 300 words or less'
    }
  }
});
