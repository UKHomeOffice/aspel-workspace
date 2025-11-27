const merge = require('lodash/merge');
const base = require('./base');

module.exports = merge(
  {},
  base,
  {
    title: 'Enter participant details',
    description: `\
You are applying for a category E PIL on behalf of this course participant.
A category E PIL is a personal licence for higher education or training courses.`,
    buttons: {
      submit: 'Continue',
      cancel: 'Cancel'
    }
  }
);
