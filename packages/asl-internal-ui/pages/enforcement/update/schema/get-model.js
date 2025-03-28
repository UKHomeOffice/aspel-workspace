const { flatten } = require('lodash');

const getModel = subject => {
  if (!subject.flags || subject.flags.length < 1) {
    return {};
  }

  const flags = subject.flags.map(f => {
    return f.modelType === 'establishment' ? `establishment-${f.establishmentId}` : `${f.modelType}-${f.modelId}`;
  });

  const modelOptions = flatten(
    subject.flags
      .filter(f => f.modelType === 'establishment')
      .map(f => f.modelOptions.map(opt => `${opt}-${f.establishmentId}`))
  );

  return {
    flagStatus: subject.flags[0].status, // status is same for all subject flags
    flags,
    remedialAction: subject.flags[0].remedialAction,
    modelOptions
  };
};

module.exports = getModel;
