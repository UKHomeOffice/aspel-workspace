const { merge } = require('lodash');
const baseContent = require('../../content');

module.exports = merge({}, baseContent, {
  pageTitle: 'Update course details',
  title: 'Update course details',
  buttons: {
    submit: 'Continue',
    cancel: 'Cancel'
  }
});
