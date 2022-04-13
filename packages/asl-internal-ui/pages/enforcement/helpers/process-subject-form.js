const { pick } = require('lodash');

const processEditForm = (subject, formValues) => {
  const { flagStatus, flags, remedialAction } = formValues;

  subject.flags = flags.map(flag => {
    // flag form values are in the format `<modelType>-<modelId>` except for establishment which is just `establishment`
    const modelType = flag.substring(0, flag.indexOf('-'));

    // leave modelId blank for establishments (est id is int not uuid)
    const modelId = modelType === 'establishment'
      ? undefined
      : flag.substring(flag.indexOf('-') + 1);

    return {
      subjectId: subject.id,
      establishmentId: subject.establishment.id,
      modelType,
      modelId,
      status: flagStatus,
      remedialAction
    };
  });

  return pick(subject, ['id', 'caseId', 'establishmentId', 'profileId', 'flags']);
};

module.exports = processEditForm;
