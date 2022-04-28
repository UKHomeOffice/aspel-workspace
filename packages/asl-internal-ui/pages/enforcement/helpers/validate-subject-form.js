const { isEmpty } = require('lodash');

const validateSubjectForm = formValues => {
  let errors = {};
  const { flagStatus, flags, modelOptions, remedialAction } = formValues;

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

  // if an establishment flag is set, then at least one model option must be set
  flags.forEach(flag => {
    const [, modelType, id] = flag.match(/^([a-z]+)-([a-f0-9-]+)$/);
    if (modelType === 'establishment') {
      if (!modelOptions.some(opt => !!opt.match(new RegExp(`-${id}$`)))) {
        errors.modelOptions = 'required';
      }
    }
  });

  return isEmpty(errors) ? undefined : errors;
};

module.exports = validateSubjectForm;
