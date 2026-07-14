const { merge } = require('lodash');
const namedRoles = require('../../../role/content/named-roles');
const skillsAndExperienceContent = require('../../../role/named-person-mvp/content/skills-and-experience');

module.exports = merge({}, skillsAndExperienceContent, {
  namedRoles,
  'sticky-nav': {
    applicant: 'Applicant',
    role: 'Amendment details',
    roleApplication: 'Role application details',
    conditions: 'Establishment conditions'
  },
  mandatoryTrainingRequirements: 'NACWO mandatory training requirements',
  trainingRecord: `{{profile.firstName}}'s training record`,
  fields: {
    role: {
      label: 'Role'
    },
    rcvsNumber: {
      label: 'RCVS number'
    }
  },
  action: {
    assigned: 'Assigned to',
    removed: 'Removed from'
  },
  remaining: {
    some: 'Remaining users with this role',
    none: 'There are no other users currently holding this role'
  },
  conditions: {
    title: 'Conditions',
    hasConditions: 'In addition to the [standard conditions of Section 2C licences](https://www.gov.uk/government/publications/establishment-licence-standard-conditions/establishment-licence-standard-conditions):',
    noConditions: 'The [standard conditions of Section 2C licences](https://www.gov.uk/government/publications/establishment-licence-standard-conditions/establishment-licence-standard-conditions) apply.'
  },
  reminders: {
    title: 'Condition deadline',
    set: 'Set a reminder for deadlines associated with this condition',
    hint: 'Licence holders will receive reminders a month before, a week before and on the day the condition is due to be met. ASRU will receive a reminder when the deadline has passed.'
  },
  buttons: {
    save: 'Save'
  }
});
