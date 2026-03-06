const { merge } = require('lodash');
const baseContent = require('../../../profile/content');

module.exports = merge({}, baseContent, {
  title: 'Before you nominate someone for a {{roleType}} role',
  supportingGuidanceTitle: 'Supporting guidance on GOV.UK',
  beforeYouNominateText: {
    NACWO: {
      title: 'Before you nominate someone for a {{roleType}} role',
      desc: `\
### Before you nominate someone for a {{roleType}} role you must ensure:

* they have agreed to be nominated
* the establishment licence (PEL) holder (or legally accountable person) supports the application
* you have added them as an ASPeL user

### Mandatory training requirements

You must ensure:

* they meet the mandatory training requirements, or they have grounds for exemption
* the Named Training and Competency Officer (NTCO) has endorsed their training and exemptions:
  * the nominee has discussed their training and exemptions with the NTCO
  * the NTCO has checked their mandatory training certificates
  * the NTCO has checked any certificates and evidence to support exemption requests, and emailed them to ASRU Licensing: [ASRULicensing@homeoffice.gov.uk](mailto:ASRULicensing@homeoffice.gov.uk)
* they have updated their training and exemptions in their [training record in ASPeL]({{trainingDashboardUrl}})

### Skills and experience

You will need to describe how they demonstrate the recommended skills and experience set out in the [NACWO role guide](https://www.gov.uk/guidance/nominate-someone-for-a-named-animal-care-and-welfare-officer-role).

### Conflict of interest declaration

You must ensure the nominee has no significant conflict of interest, and their declaration form is held on record at the establishment.`
    },
    PELH: {
      title: 'Before you nominate someone for the PEL holder role',
      desc: `\
### Before you nominate someone for the PEL holder role you must ensure:

* you can describe why they are suitable for the role
* they have no significant conflict of interest, and you have sent the declaration form to ASRU Licensing: [ASRULicensing@homeoffice.gov.uk](mailto:ASRULicensing@homeoffice.gov.uk)`},
    default: {
      title: 'Before you nominate someone for a named person role',
      desc: `\
  ### Before you nominate someone for a named person role you must ensure:

* they have agreed to be nominated
* you have added them as an ASPeL user
* the establishment licence (PEL) holder supports the nomination and is confident that the nominee has the recommended skills and experience, as outlined in the relevant named person role guide

### If there are mandatory training requirements

There are mandatory training requirements for NACWO and NVS/SQP roles. Ensure the following:

* they meet the mandatory training requirements, or they have grounds for exemption
* the Named Training and Competency Officer (NTCO) has endorsed their training and exemptions:
  * the nominee has discussed their training and exemptions with the NTCO
  * the NTCO has checked their mandatory training certificates
  * the NTCO has checked any certificates and evidence to support exemption requests, and emailed them to ASRU Licensing: [ASRULicensing@homeoffice.gov.uk](mailto:ASRULicensing@homeoffice.gov.uk)
* they have updated their training and exemptions in their [training record in ASPeL]({{trainingDashboardUrl}})

### If a conflict of interest declaration is needed

For NACWO and NVS/SQP, ensure the declaration form has been completed and a record kept at the establishment. You do not need to send the declaration form to ASRU.

For PEL holder/NPRC, you need to send the form to ASRU Licensing: [ASRULicensing@homeoffice.gov.uk](mailto:ASRULicensing@homeoffice.gov.uk)`
    }
  },
  buttons: {
    submit: 'Continue',
    cancel: 'Cancel'
  }
});
