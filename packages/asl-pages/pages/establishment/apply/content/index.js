module.exports = {
  page: {
    title: 'Submit establishment application',
    summary: `Please check the information you have provided so far for your project licence application. We have stated
    the minimum amount of information required for each below.`
  },
  section: {
    details: {
      title: 'Establishment details',
      fields: {
        name: {
          label: 'Name'
        },
        address: {
          label: 'Address'
        },
        licensed: {
          label: 'Licensed to carry out'
        }
      },
      actions: {
        edit: 'Edit establishment details'
      }
    },
    approvedAreas: {
      title: 'Approved areas',
      fields: {
        total: {
          label: 'Total approved areas'
        }
      },
      actions: {
        add: 'Add an approved area'
      }
    },
    namedPeople: {
      title: 'Named people',
      hint: 'You must have either an NPRC or a PEL holder (but not both), and at least one person in each of the other named roles.',
      actions: {
        add: 'Add {{role}}'
      }
    },
    comments: {
      title: 'Comments',
      hint: 'Comments can be seen by inspectors and Home Office team members. They will be added to the \'Latest activity\' log of this task'
    }
  },
  fields: {
    comments: {
      label: ''
    },
    declaration: {
      yes: {
        label: 'By submitting this application, I confirm that the establishment will be responsible for the payment of fees for all relevant licences held at this establishment, should this application be successful.'
      }
    }
  },
  declarations: {
    title: 'Please confirm that you understand'
  },
  errors: {
    declarations: {
      customValidate: 'Please confirm that you understand'
    }
  }
};
