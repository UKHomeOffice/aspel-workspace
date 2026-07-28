const { merge } = require('lodash');
const baseContent = require('../../../profile/content');

module.exports = merge({}, baseContent, {
  title: 'Edit your details',
  pageTitle: 'Edit your details',
  fields: {
    comments: {
      label: 'Why are you making this change?',
      hint: 'If you are a licence holder or named person then your changes will need to be approved by the Home Office.'
    }
  },
  errors: {
    // ASL-5108 (Bryony Scenario 7): GDS date messages. Only the "Enter ..." line
    // is bespoke; the rest (must include a.../real date/year/past) come from the
    // shared GDS templates using dateLabel "Date of birth".
    dob: {
      date: {
        enter: 'Enter your date of birth'
      }
    }
  },
  buttons: {
    submit: 'Submit'
  }
});
