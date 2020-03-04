const baseContent = require('./index');
const { merge } = require('lodash');

module.exports = merge({}, baseContent, {
  title: 'Confirm change to licence number',
  buttons: {
    submit: 'Update now'
  },
  notifications: {
    licenceNumberUpdated: 'Licence number updated'
  }
});
