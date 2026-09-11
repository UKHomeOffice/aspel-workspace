const { merge } = require('lodash');
const baseContent = require('./');

module.exports = merge({}, baseContent, {
  pageTitle: 'Confirm category E licence revocation',
  title: 'Confirm revocation',
  buttons: {
    submit: 'Submit'
  }
});
