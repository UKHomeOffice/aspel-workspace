const { merge } = require('lodash');
const baseContent = require('../../../content');

module.exports = merge({}, baseContent, {
  title: 'Amend profile',
  fields: {
    type: {
      label: 'Please select the role you want to remove.'
    },
    comment: {
      label: 'Why are you removing this named role from this person?'
    }
  },
  buttons: {
    submit: 'Continue'
  },
  errors: {
    type: {
      required: 'Please select a named role'
    }
  }
});
