const { merge } = require('lodash');
const baseContent = require('../../../profile/content');

module.exports = merge({}, baseContent, {
  title: '{{roleType}} skills and experience',
  desc: 'Describe how {{profile.firstName}} demonstrates the following skills and experience:',
  fields: {
    experience: {
      label: 'Suitable expertise and training to minimise suffering and optimise the welfare of animals they are responsible for',
      hint: 'State if this is covered by mandatory training modules PILA, L, E1 and E2'
    },
    authority: {
      label: 'Appropriate personal and managerial authority to promote high standards',
      hint: 'For example, they are managing a service, area or team of animal technicians'
    },
    skills: {
      label: 'Good communication and diplomacy skills to champion a culture of care among both scientificand husbandry staff',
    }
  },
  buttons: {
    submit: 'Save and continue',
    cancel: 'Cancel'
  },
  errors: {
    experience: {
      required: 'Describe how they demonstrate suitable expertise and training to minimise suffering and optimise the welfare of animals they are responsible for'
    },
    authority: {
      required: 'Describe how they demonstrate appropriate personal and managerial authority to promote high standards'
    },
    skills: {
      required: 'Describe how they demonstrate good communication and diplomacy skills to champion a culture of care among both scientificand husbandry staff'
    }
  }
});
