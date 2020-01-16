const baseContent = require('./index');
const { merge } = require('lodash');

module.exports = merge({}, baseContent, {
  title: 'Confirm change to date granted',
  expiryInThePast: `This change will result in an expiry date that's in the past. This means the licence will expire immediately.`,
  buttons: {
    submit: 'Update now'
  },
  notifications: {
    issueDateUpdated: 'Date granted updated'
  }
});
