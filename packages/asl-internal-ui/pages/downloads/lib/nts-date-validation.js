const dateValidation = require('@ukhomeoffice/asl-components/src/date-range-input/date-validation');

const dateFields = ['date-from', 'date-to'];

function hasDateParts(query, name) {
  return ['day', 'month', 'year'].some(part => query[`${name}-${part}`]);
}

function getDateQueryValue(query, name) {
  if (query[name]) {
    return query[name];
  }

  if (!hasDateParts(query, name)) {
    return '';
  }

  const day = query[`${name}-day`] || '';
  const month = query[`${name}-month`] || '';
  const year = query[`${name}-year`] || '';

  return `${year}-${month}-${day}`;
}

function parseDate(value) {
  return dateValidation.parseDate(value);
}

function isValidDate(value) {
  return parseDate(value).isValid();
}

function normaliseDate(value) {
  return parseDate(value).format('YYYY-MM-DD');
}

function getDateError(query, name) {
  const value = getDateQueryValue(query, name);

  if (!value) {
    return 'required';
  }

  if (!isValidDate(value)) {
    return 'validDate';
  }

  return null;
}

function getNtsDateRangeModel(query) {
  return Object.fromEntries(dateFields.map(name => [name, getDateQueryValue(query, name)]));
}

function hasBoundaryError(value) {
  return Boolean(dateValidation.getBoundaryErrorCode(value));
}

function validateNtsDateRangeQuery(query) {
  const model = getNtsDateRangeModel(query);
  const errors = Object.fromEntries(
    dateFields
      .map(name => [name, getDateError(query, name)])
      .filter(([, error]) => error)
  );

  if (query.ra === undefined || query.ra === '') {
    errors.ra = 'required';
  } else if (!['true', 'false'].includes(String(query.ra).toLowerCase())) {
    errors.ra = 'invalid';
  }

  const hasDateErrors = Object.keys(errors).length > 0;
  const startDate = parseDate(model['date-from']);
  const endDate = parseDate(model['date-to']);
  const hasInvalidBoundaries = !hasDateErrors && (hasBoundaryError(model['date-from']) || hasBoundaryError(model['date-to']));
  const hasInvalidRange = !hasDateErrors && startDate.isAfter(endDate, 'day');
  const exceedsMaximumRange = !hasDateErrors && endDate.isAfter(startDate.clone().add(6, 'months'), 'day');

  if (exceedsMaximumRange) {
    errors['date-to'] = 'maximumDateRange';
  }

  return {
    isValid: !hasDateErrors && !hasInvalidBoundaries && !hasInvalidRange && !exceedsMaximumRange,
    errors,
    model
  };
}

module.exports = {
  getDateQueryValue,
  getNtsDateRangeModel,
  normaliseDate,
  validateNtsDateRangeQuery
};
