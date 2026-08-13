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
    submit: 'Continue',
    cancel: 'Cancel'
  },
  errors: {
    incomplete: {
      required: 'Enter which training modules need to be completed'
    },
    delayReason: {
      required: {
        NVS: 'Enter a reason why the module is not yet completed',
        default: 'Enter a reason why there is a delay in completing these modules'
      }
    }
    // completeDate has no bespoke messages: the copy deck wording is exactly what
    // the generic GDS date templates produce from the schema's `dateLabel`
    // ("Completion date must be in the future", "... must include a day and
    // month", "Year must include 4 numbers"). The role-specific "Enter a date
    // when ..." comes from the schema's `dateEnter`.
  }
};
