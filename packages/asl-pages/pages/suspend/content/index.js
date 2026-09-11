module.exports = {
  suspend: {
    title: 'Suspend {{licenceType}} licence',
    pageTitleConfirm: 'Confirm {{licenceType}} licence suspension',
    fields: {
      comment: {
        label: 'Why are you suspending this licence?'
      }
    },
    buttons: {
      submit: 'Continue'
    },
    errors: {
      comment: {
        required: 'Tell us why you are suspending this licence'
      }
    }
  },
  reinstate: {
    title: 'Reinstate {{licenceType}} licence',
    pageTitleConfirm: 'Confirm {{licenceType}} licence reinstatement',
    fields: {
      comment: {
        label: 'Why are you reinstating this licence?'
      }
    },
    buttons: {
      submit: 'Continue'
    },
    errors: {
      comment: {
        required: 'Tell us why you are reinstating this licence'
      }
    }
  }
};
