const { get, uniqBy, omitBy, mapValues, isEmpty } = require('lodash');

const getAdditionalEstablishments = (project, version) => {
  // Honor when other-establishments has been set to false
  const hasAdditionalEstablishments = get(version, 'data.other-establishments', false);
  const proposedAdditionalEstablishments = hasAdditionalEstablishments
    ? get(version, 'data.establishments', []).filter(e => e['establishment-id'])
    : [];
  const removedAAIds = get(version, 'data.establishments', []).filter(e => e.deleted).map(e => e['establishment-id']);
  const projectAdditionalEstablishments = project.additionalEstablishments.filter(e => e.status !== 'removed');

  return uniqBy([
    ...projectAdditionalEstablishments,
    ...proposedAdditionalEstablishments
  ], est => est['establishment-id'] || est.id).filter(e => !removedAAIds.includes(e.id));
};

// Lodash isEmpty returns true for numbers, booleans, etc.
const isEmptyValue = (value) => {
  switch (typeof value) {
    case 'undefined':
      return true;
    case 'number':
    case 'function':
    case 'symbol':
    case 'bigint':
      return false;
    case 'object':
    case 'string':
      return isEmpty(value);
    case 'boolean':
      return !value;
  }
};

/**
 * Normalises all empty scalar values to undefined, and recursively removes
 * nested empty properties/values from objects and arrays.
 * @param value
 * @returns {undefined|*}
 */
const deepRemoveEmpty = (value) => {
  if (Array.isArray(value)) {
    return value.map(deepRemoveEmpty).filter(v => !isEmptyValue(v));
  }

  if (value && typeof value === 'object') {
    const normalised = mapValues(value, deepRemoveEmpty);
    return omitBy(normalised, isEmptyValue);
  }

  return isEmptyValue(value) ? undefined : value;
};

module.exports = {
  getAdditionalEstablishments,
  deepRemoveEmpty
};
