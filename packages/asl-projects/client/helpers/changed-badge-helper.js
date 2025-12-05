import minimatch from 'minimatch';

export const changedFrom = (fields, source, protocolId, excludeSelf = false) => {
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
      // Logic to suppress "False Positives" for Container updates:
      // If a container (like a Step) is flagged as changed, we want to know if it's a "real" content change
      // or just a metadata/save update.
      // We check if the container change is accompanied by changes to its children (fields).

      // 1. Check if this change record EXACTLY matches the field we are rendering.
      //    If excludeSelf is true, we want to ignore this match (treat it as noise).
      const endsWithTarget = fields.some((field) => excludeSelf && item.endsWith(field));

      // 2. Check if this item is a substring of any OTHER item in the change list.
      //    If it is contained elsewhere, it means "Children Changed" -> Valid Change.
      const isContainedElsewhere = arr.some(other => other !== item && other.includes(item));

      // KEEP the item if:
      // - It is NOT the ignored target itself (endsWithTarget is false)
      // OR
      // - It IS the target, but it implies child changes (isContainedElsewhere is true)
      return !endsWithTarget || isContainedElsewhere;
    });
  } else {
    cleanedSource = source;
  }
  return cleanedSource.length && fields.some(field => {
    return cleanedSource.some(change => minimatch(change, field));
  });
};
