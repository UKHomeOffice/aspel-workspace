const { merge } = require('lodash');
const baseContent = require('../../../profile/content');

module.exports = merge({}, baseContent, {
  reviewRoleApplication: 'Remove role',
  applyingFor: 'You are removing:',
  onBehalfOf: 'From the user:',
  rcvsNumber: 'RCVS number:',
  explanation: 'Why are you removing this role from this person?',
  buttons: {
    submit: 'Submit'
  }
});
