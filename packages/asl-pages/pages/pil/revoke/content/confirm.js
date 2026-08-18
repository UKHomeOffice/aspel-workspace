const { merge } = require('lodash');
const baseContent = require('./');

module.exports = merge({}, baseContent, {
  pageTitle: 'Confirm personal licence revocation',
  title: 'Confirm revocation',
  buttons: {
    submit: 'Submit'
  }
});
