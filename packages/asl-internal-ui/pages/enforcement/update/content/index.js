const { merge } = require('lodash');
const enforcementContent = require('../../content');

module.exports = merge({}, enforcementContent, {
  page: {
    title: 'Add enforcement subjects'
  },
  subjects: {
    heading: 'Enforcement subjects',
    repeaterHeading: 'Enforcement subject {{idx}}'
  },
  flag: {
    heading: 'Enforcement flag',
    status: 'Enforcement flag status',
    appliedTo: {
      heading: 'Flag applied to',
      profile: {
        link: `{{profile.firstName}} {{profile.lastName}}'s profile and related tasks`,
        summary: `The flag will appear on:
         * any requests by the subject to change their name or date of birth
         * applications for new licences
         * requests to transfer project licences if they hold one or more project licences
         * any tasks related to their named role if they hold a named role`
      },
      pil: {
        link: `{{profile.firstName}} {{profile.lastName}}'s personal licence {{profile.pilLicenceNumber}}`,
        summary: `The flag will appear on:
        * requests to amend, revoke or transfer the licence to a new establishment`
      },
      project: {
        link: `{{profile.firstName}} {{profile.lastName}}'s project licence {{project.licenceNumber}}`,
        summary: `The flag will appear on:
        * requests to amend, revoke or transfer the licence to a new establishment
        * requests to transfer the licence to another persion`
      }
    }
  },
  action: {
    listCases: 'View all enforcement cases',
    editFlag: 'Edit enforcement flag'
  },
  caseNumber: {
    label: '**Case number** {{number}}'
  },
  establishment: {
    label: 'Establishment'
  },
  profile: {
    label: 'Person'
  },
  roles: {
    label: 'Roles'
  },
  licences: {
    label: 'Licences'
  }
});
