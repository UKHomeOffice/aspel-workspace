const { merge } = require('lodash');
const baseContent = require('../content');

module.exports = merge({}, baseContent, {
  title: 'Create an inactive establishment',
  summary: `Once the new establishment has been created, you should invite an admin user to it so they can begin to fill in further details.`,
  fields: {
    name: {
      label: 'What is the name of the new establishment?'
    }
  },
  errors: {
    name: {
      required: 'Please enter the name of your new establishment'
    }
  },
  notifications: {
    establishmentCreated: 'A new establishment has been created'
  }
});
