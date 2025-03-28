const { pick } = require('lodash');

const processEditForm = (subject, formValues) => {
  let { flagStatus, flags, remedialAction } = formValues;

  subject.flags = flags.map(flag => {
    // form values are in the format `<modelType>-<modelId>` (or `<modelType>-<establishmentId>` for establishment flags)
    const modelType = flag.substring(0, flag.indexOf('-'));

    let modelId = flag.substring(flag.indexOf('-') + 1);
    let establishmentId;
    let modelOptions;

    if (modelType === 'establishment') {
      modelId = undefined; // est id is not a uuid so will cause issues if stored in modelId
      establishmentId = parseInt(flag.substring(flag.indexOf('-') + 1));

      // modelOptions are in the format `<opt>-<estId>` but we just want the opt part for the correct establishment
      modelOptions = formValues.modelOptions
        .filter(opt => !!opt.match(new RegExp(`-${establishmentId}$`)))
        .map(opt => opt.substring(0, opt.indexOf('-')));
    }

    return {
      subjectId: subject.id,
      establishmentId,
      modelType,
      modelId,
      modelOptions,
      status: flagStatus,
      remedialAction
    };
  });

  return pick(subject, ['id', 'caseId', 'establishmentId', 'profileId', 'flags']);
};

module.exports = processEditForm;
