const { merge } = require('lodash');
const baseContent = require('../../../../profile/content');

module.exports = merge({}, baseContent, {
  declaration: 'Declaration',
  applyingFor: 'You are assigning:',
  onBehalfOf: 'To:',
  rcvsNumber: 'RCVS number:',
  explanation:
    'All mandatory training is complete and their training record is up to date.',
  declarationDesc: `\
  ### By submitting this application, I confirm that {{profile.firstName}} has agreed to be nominated for the NACWO role.

  ### I confirm that the NTCO has endorsed {{profile.firstName}}'s training and exemptions.

  ### I also confirm that the PEL holder supports the application and is confident that:

  * {{profile.firstName}} has the following recommended skills and experience:

    * suitable expertise and training to minimise suffering and optimise the welfare of animals they are responsible for (this is covered by mandatory training modules PILA, L and E1)
    * appropriate personal and managerial authority to promote high standards - for example, they are managing a service, area or team of animal technicians
    * good communication and diplomacy skills to champion a culture of care among both scientific and husbandry staff
  
  * {{profile.firstName}} has no significant conflict of interest, and their declaration form is held on record at the establishment`,
  agreement: 'I agree with all the above statements',
  buttons: {
    submit: 'Submit'
  }
});
