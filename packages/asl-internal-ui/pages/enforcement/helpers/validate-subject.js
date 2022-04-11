const { isEmpty } = require('lodash');

module.exports = formValues => {
  let errors = {};
  const { flagStatus, flags, remedialAction } = formValues;

  if (!['open', 'closed', 'no-breach'].includes(flagStatus)) {
    errors.flagStatus = 'required';
  }

  if (flagStatus === 'open' || flagStatus === 'closed') {
    if (flags.length < 1) {
      errors.flags = 'required';
    }
  }

  if (flagStatus === 'closed') {
    if (remedialAction.length < 1) {
      errors.remedialAction = 'required';
    }
  }

  return isEmpty(errors) ? undefined : errors;
};
