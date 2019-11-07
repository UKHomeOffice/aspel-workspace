const { merge } = require('lodash');
const baseContent = require('../../content');

module.exports = merge({}, baseContent, {
  title: 'Create an inactive establishment',
  summary: `Once the new inactive establishment has been created, you should invite an admin user to it so they can begin to fill in further details.

  When all the establishment's information has been added, you will then be able to grant the establishment's licence.`,
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
    establishmentCreated: 'Your inactive establishment has been created'
  }
});
