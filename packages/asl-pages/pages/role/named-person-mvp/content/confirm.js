const { merge } = require('lodash');
const baseContent = require('../../../profile/content');
const skillsAndExperienceContent = require('./skills-and-experience');

module.exports = merge({}, baseContent, skillsAndExperienceContent, {
  confirmTitle: 'Check and submit',
  applyingFor: 'You are assigning:',
  onBehalfOf: 'To:',
  explanation: {
    trainingHeading: 'Mandatory training',
    skillsAndExperienceHeading: 'Skills and experience',
    trainingComplete:
      'All mandatory training is complete and their training record is up to date.',
    exemptionRequest:
      '{{profile.firstName}} has requested an exemption from one or more modules',
    nvs: {
      rcvsNumber: 'RCVS number:',
      trainingNotComplete: 'The NVS module is not yet completed',
      reasonForDelay: 'Reason why the module is not yet completed:',
      completionDate: 'Date the module will be completed:'
    },
    nacwo: {
      delay: 'There is an unavoidable delay in completing one or more modules',
      trainingNotComplete: 'NACWO training modules to be completed:',
      reasonForDelay: 'Reason for delay:',
      completionDate: 'Date all mandatory training will be completed:'
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
**By submitting this application, I confirm that:**

  * {{profile.firstName}} {{profile.lastName}} has agreed to be nominated for the NACWO role
  * the NTCO has endorsed {{profile.firstName}}'s training and exemptions
  * the PEL holder (or legally accountable person) supports the nomination and is confident that {{profile.firstName}} has no significant conflict of interest, and their declaration form is held on record at the establishment`,
    nvs: `\
**By submitting this application, I confirm that:**

  * {{profile.firstName}} {{profile.lastName}} has agreed to be nominated for the NVS role
  * the NTCO has endorsed {{profile.firstName}}'s training and exemptions
  * the PEL holder (or legally accountable person) supports the nomination and is confident that {{profile.firstName}} has no significant conflict of interest, and their declaration form is held on record at the establishment`,
    nio: `\
**By submitting this application, I confirm that:**

  * {{profile.firstName}} {{profile.lastName}} has agreed to be nominated for the NIO role
  * the establishment licence (PEL) holder (or legally accountable person) supports the nomination`,
    ntco: `\
**By submitting this application, I confirm that:**

  * {{profile.firstName}} {{profile.lastName}} has agreed to be nominated for the NTCO role
  * the PEL holder (or legally accountable person) supports the nomination`,
    sqp: `\
**By submitting this application, I confirm that:**

  * there is no vet available with the right expertise
  * {{profile.firstName}} {{profile.lastName}} has agreed to be nominated for the SQP role
  * the NTCO has endorsed {{profile.firstName}}'s training and exemptions
  * the PEL holder (or legally accountable person) supports the nomination and is confident that {{profile.firstName}} has no significant conflict of interest, and their declaration form is held on record at the establishment`,
    default: `\
**By submitting this application, I confirm that:**

  * {{profile.firstName}} {{profile.lastName}} has agreed to be nominated for the {{roleLabel}}
  * the legally accountable person supports the nomination`
  },
  buttons: {
    submit: 'Submit'
  }
});
