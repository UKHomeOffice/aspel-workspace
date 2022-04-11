const subjectToFlags = (subject, formValues) => {
  const { flagStatus, flags, remedialAction } = formValues;

  return flags.map(flag => {
    const modelType = flag.substring(0, flag.indexOf('-'));

    // leave modelId blank for establishments (est id is int not uuid)
    const modelId = modelType === 'establishment'
      ? undefined
      : flag.substring(flag.indexOf('-') + 1);

    return {
      caseId: subject.caseId,
      establishmentId: subject.establishment.id,
      profileId: subject.id,
      modelType,
      modelId,
      status: flagStatus,
      remedialAction
    };
  });
};

module.exports = subjectToFlags;
