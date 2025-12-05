import minimatch from 'minimatch';

export const changedFrom = (fields, source, protocolId, onlyChildFieldChanges = false) => {
  //Protocol, removing config fields, which causing false change badge showing up
  let cleanedSource;
  if (protocolId) {
    cleanedSource = source.filter(item =>
      !item.endsWith('usedInProtocols') &&
      !item.endsWith('reusedStep') &&
      !item.endsWith('reusableStepId') &&
      !item.endsWith('usedInProtocols.protocolId') &&
      !item.endsWith('usedInProtocols.protocolNumber')
    );
    cleanedSource = cleanedSource.filter((item, _, arr) => {
      // Check if it ends with any of the fields
      const endsWithTarget = fields.some((field) => onlyChildFieldChanges && item.endsWith(field));

      // Check if this item is a substring of any other item in the array
      const isContainedElsewhere = arr.some(other => other !== item && other.includes(item));

      // Keep it if it doesn't end with field OR it's contained elsewhere
      return !endsWithTarget || isContainedElsewhere;
    });
  } else {
    cleanedSource = source;
  }
  return cleanedSource.length && fields.some(field => {
    return cleanedSource.some(change => minimatch(change, field));
  });
};
