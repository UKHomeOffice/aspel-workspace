module.exports = {
  page: {
    title: 'Add enforcement subjects'
  },
  subjects: {
    heading: 'Enforcement subjects',
    repeaterHeading: 'Enforcement subject {{idx}}'
  },
  flag: {
    heading: 'Enforcement flag',
    status: {
      read: 'Enforcement flag status'
    },
    appliedTo: {
      heading: 'Flag applied to'
    },
    remedialAction: {
      heading: 'Remedial action'
    }
  },
  fields: {
    flagStatus: {
      label: 'Select status for enforcement flag',
      options: {
        open: {
          label: 'Ongoing enforcement'
        },
        closed: {
          label: 'Closed enforcement - remedial action applied',
          hint: 'Flag will remain in place for 5 years'
        },
        'no-breach': {
          label: 'No breach',
          hint: 'Delete any remaining flags and remove subject from case'
        }
      }
    },
    flags: {
      label: 'Apply flags to',
      hint: 'Select all that apply',
      options: {
        profile: {
          // prevent escaping in names, otherwise apostrophes (e.g. O'Brien) get escaped
          label: `{{{profile.firstName}}} {{{profile.lastName}}}'s profile and related tasks`,
          summary: 'Profile tasks to be flagged',
          details: `These tasks will be flagged:
* any requests by the subject to change their name or date of birth
* applications for new licences
* requests to transfer project licences if they hold one or more project licences
* any tasks related to their named role if they hold a named role`
        },
        pil: {
          label: `{{{profile.firstName}}} {{{profile.lastName}}}'s personal licence {{profile.pilLicenceNumber}} and related tasks`,
          summary: 'Profile tasks to be flagged',
          details: `These tasks will be flagged:
* requests to amend, revoke or transfer the licence to a new establishment`
        },
        project: {
          label: `{{{profile.firstName}}} {{{profile.lastName}}}'s project licence {{project.licenceNumber}} and related tasks`,
          summary: 'Profile tasks to be flagged',
          details: `These tasks will be flagged:
* requests to amend, revoke or transfer the licence to a new establishment
* requests to transfer the licence to another person`
        },
        establishment: {
          label: `{{{profile.firstName}}} {{{profile.lastName}}}'s establishment licence at {{establishment.name}} and related tasks`,
          summary: 'Establishment tasks to be flagged',
          details: `These tasks will be flagged:`,
          modelOptions: {
            places: `requests to change the establishment's approved areas`,
            roles: `requests to change the establishment's named people or PEL holder`,
            details: `requests to change the establishment details - for example, the address or what the establishment is licensed to do`
          }
        }
      }
    },
    remedialAction: {
      label: 'Select remedial action taken',
      options: {
        'inspector-advice': {
          label: 'Inspector advice'
        },
        'letter-of-reprimand': {
          label: 'Letter of reprimand'
        },
        'reprimand-retraining': {
          label: 'Letter of reprimand and retraining'
        },
        'compliance-notice': {
          label: 'Compliance notice'
        },
        'suspension-retraining': {
          label: 'Suspension and retraining'
        },
        'licence-revocation': {
          label: 'Revocation of licence'
        },
        'other': {
          label: 'Other'
        }
      }
    },
    modelOptions: {
      label: 'Apply flags to',
      hint: 'Select all that apply',
      options: {
        places: {
          label: `request to change the establishment's approved areas`
        },
        roles: {
          label: `requests to change the establishment's named people or PEL holder`
        },
        details: {
          label: `requests to change the establishment details`,
          hint: 'For example, the address or what the establishment is licensed to do'
        }
      }
    }
  },
  action: {
    listCases: 'View all enforcement cases',
    editFlag: 'Edit enforcement flag',
    addSubject: 'Add another person'
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
  },
  buttons: {
    add: {
      establishment: 'Add establishment',
      profile: 'Add person'
    },
    cancel: 'Cancel'
  },
  errors: {
    flagStatus: {
      required: 'Select an option'
    },
    remedialAction: {
      required: 'Select an option'
    },
    modelOptions: {
      required: 'Select an option'
    }
  }
};
