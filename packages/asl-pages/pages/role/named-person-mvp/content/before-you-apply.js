const { merge } = require('lodash');
const baseContent = require('../../../profile/content');
const { getBeforeYouApplyRoleGuide } = require('./named-person-guidance');
const { ROLE_TYPES } = require('../role-types');

const sharedNamedPersonNominationBody = `\
{{#requiresVetAvailabilityCheck}}
* there is no vet available with the right expertise
{{/requiresVetAvailabilityCheck}}
* they have agreed to be nominated
* the establishment licence (PEL) holder (or legally accountable person) supports the application
* you have added them as an ASPeL user

## Mandatory training requirements

You must ensure:

* they meet the mandatory training requirements, or they have grounds for exemption
* the Named Training and Competency Officer (NTCO) has endorsed their training and exemptions:
  * the nominee has discussed their training and exemptions with the NTCO
  * the NTCO has checked their mandatory training certificates
  * the NTCO has checked any certificates and evidence to support exemption requests, and emailed them to ASRU Licensing: [asrulicensing@homeoffice.gov.uk](mailto:asrulicensing@homeoffice.gov.uk)
* they have updated their training and exemptions in their [training record in ASPeL]({{trainingDashboardUrl}})

## Skills and experience

You will need to describe how they demonstrate the recommended skills and experience set out in the [{{roleGuideLabel}}]({{roleGuideUrl}}).

## Conflict of interest declaration

You must ensure the nominee has no significant conflict of interest, and their declaration form is held on record at the establishment.`;

const sharedNamedPersonNominationText = {
  title: 'Before you nominate someone for a {{roleType}} role',
  desc: `\
**Before you nominate someone for a {{roleType}} role you must ensure:**

${sharedNamedPersonNominationBody}`
};

const nvsNamedPersonNominationText = {
  title: 'Before you nominate someone for an NVS role',
  desc: `\
**Before you nominate someone for an NVS role you must ensure:**

${sharedNamedPersonNominationBody}`
};

const sharedRoleGuideNominationText = {
  title: 'Before you nominate someone for an {{roleType}} role',
  desc: `\
## Before you nominate someone for an {{roleType}} role you must ensure:

* they have agreed to be nominated
* the establishment licence (PEL) holder (or legally accountable person) supports the nomination
* you can describe how they demonstrate the recommended skills and experience set out in the [{{roleGuideLabel}}]({{roleGuideUrl}})
* you have added them as an ASPeL user`
};

module.exports = merge({}, baseContent, {
  title: 'Before you nominate someone for a {{roleType}} role',
  supportingGuidanceTitle: 'Supporting guidance on GOV.UK',
  beforeYouNominateText: {
    shared: sharedNamedPersonNominationText,
    NVS: nvsNamedPersonNominationText,
    sharedRoleGuide: sharedRoleGuideNominationText,
    templateRoles: {
      NACWO: {
        contentKey: 'shared',
        ...getBeforeYouApplyRoleGuide(ROLE_TYPES.nacwo)
      },
      NVS: {
        ...getBeforeYouApplyRoleGuide(ROLE_TYPES.nvs)
      },
      SQP: {
        contentKey: 'shared',
        ...getBeforeYouApplyRoleGuide(ROLE_TYPES.sqp),
        requiresVetAvailabilityCheck: true
      },
      NIO: {
        contentKey: 'sharedRoleGuide',
        ...getBeforeYouApplyRoleGuide(ROLE_TYPES.nio)
      },
      NTCO: {
        contentKey: 'sharedRoleGuide',
        ...getBeforeYouApplyRoleGuide(ROLE_TYPES.ntco)
      }
    },
    NPRC: {
      title: 'Before you nominate someone for an NPRC role',
      desc: `\
**Before you nominate someone for an NPRC role you must ensure:**

* they have agreed to be nominated
* the legally accountable person supports the nomination
* you can describe why they are suitable for the role
* they have no significant conflict of interest, and you have sent the declaration form to ASRU Licensing: [asrulicensing@homeoffice.gov.uk](mailto:asrulicensing@homeoffice.gov.uk)
* you have added them as an ASPeL user`
    },
    PELH: {
      title: 'Before you nominate someone for the PEL holder role',
      desc: `\
**Before you nominate someone for the PEL holder role you must ensure:**

* you can describe why they are suitable for the role
* they have no significant conflict of interest, and you have sent the declaration form to ASRU Licensing: [asrulicensing@homeoffice.gov.uk](mailto:asrulicensing@homeoffice.gov.uk)`
    },
    HOLC: {
      title: 'Before you nominate someone for a HOLC role',
      desc: `\
**Before you nominate someone for a HOLC role you must ensure:**

* they have agreed to be nominated
* the establishment licence (PEL) holder (or legally accountable person) supports the nomination
* you can describe why they are suitable for the role
* you have added them as an ASPeL user`
    }
  },
  buttons: {
    submit: 'Continue',
    cancel: 'Cancel'
  }
});
