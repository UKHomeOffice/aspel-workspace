const { merge } = require('lodash');
const baseContent = require('../../../../profile/content');

module.exports = merge({}, baseContent, {
  confirmTitle: 'Check and submit',
  applyingFor: 'You are assigning:',
  onBehalfOf: 'To:',
  rcvsNumber: 'RCVS number:',
  explanation: {
    trainingComplete:
      'All mandatory training is complete and their training record is up to date.',
    nvs: 'All mandatory training is complete and their training record is up to date.',
    nacwo: {
      exemptionRequest:
        '{{profile.firstName}} has requested an exemption from one or more modules',
      delay: 'There is an unavoidable delay in completing one or more modules',
      trainingToComplete: 'NACWO training modules to be completed:',
      reasonForDelay: 'Reason for delay:',
      trainingDate: 'Date all mandatory training will be completed:'
    }
  },
  agreement: 'I agree with {{ agreementDeterminer }} these statements',
  fields: {
    declaration: {
      title: 'Declaration'
    }
  },
  errors: {
    declaration: {
      required:
        'Select the checkbox to confirm you agree with {{ agreementDeterminer }} these statements'
    }
  },
  declarations: {
    nacwo: `\
**By submitting this application, I confirm that {{profile.firstName}} has agreed to be nominated for the NACWO role.**

**I confirm that the NTCO has endorsed {{profile.firstName}}'s training and exemptions.**

**I also confirm that the PEL holder supports the application and is confident that:**

* {{profile.firstName}} has the following recommended skills and experience:
    * suitable expertise and training to minimise suffering and optimise the welfare of animals they are responsible for (this is covered by mandatory training modules PILA, L and E1)
    * appropriate personal and managerial authority to promote high standards - for example, they are managing a service, area or team of animal technicians
    * good communication and diplomacy skills to champion a culture of care among both scientific and husbandry staff

* {{profile.firstName}} has no significant conflict of interest, and their declaration form is held on record at the establishment`,
    nvs: `\
**By submitting this application, I confirm that {{profile.firstName}} has agreed to be nominated for the NVS role.**

**I confirm that the NTCO has endorsed {{profile.firstName}}'s training and exemptions.**

**I also confirm that the PEL holder supports the application and is confident that {{profile.firstName}}:**
* has expertise in the health and welfare of the species they'll be responsible for
* has no significant conflict of interest, and their declaration form is held on record at the establishment`,
    default: `\
**By submitting this application, I confirm that {{profile.firstName}} has agreed to be nominated for the role.**

**I also confirm that the PEL holder supports the application and is confident that {{profile.firstName}} has the recommended skills and experience and is suitable for the role.**
  `
  },
  buttons: {
    submit: 'Submit'
  }
});
