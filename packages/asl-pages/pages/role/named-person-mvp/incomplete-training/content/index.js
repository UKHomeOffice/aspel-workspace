module.exports = {
  title: {
    NVS: 'NVS module details',
    default: 'Mandatory training to be completed'
  },
  fields: {
    incomplete: {
      label: `Which {{roleType}} training modules need to be completed?`,
      options: {
        'PILA (theory)': {
          label: `PILA (theory) ==Species specific==`
        },
        'PILA (skills)': {
          label: `PILA (skills) ==Species specific==`
        }
      }
    },
    completeDate: {
      label: {
        NVS: 'Date the module will be completed',
        default: 'Date all mandatory training will be completed'
      }
    },
    delayReason: {
      label: {
        NVS: 'Explain why the module is not yet completed',
        default: 'Explain why there is a delay in completing these modules'
      }
    }
  },
  buttons: {
    submit: 'Save and continue',
    cancel: 'Cancel'
  },
  errors: {
    incomplete: {
      required: 'Select all NACWO training modules that need to be completed'
    },
    delayReason: {
      required: {
        NVS: 'Enter a reason why the module is not yet completed',
        default: 'Enter a reason why there is a delay in completing these modules'
      }
    },
    completeDate: {
      required: 'The date must be a real date and include a day, month and year. The year must include 4 numbers',
      validDate: 'The date must be a real date and include a day, month and year. The year must include 4 numbers',
      dateIsAfter: 'The date must be in the future'
    }
  }
};
