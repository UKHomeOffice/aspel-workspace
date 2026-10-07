const dateValidation = require('@ukhomeoffice/asl-components/src/date-range-input/date-validation');
const { dates } = require('../schema/nts');

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

function getBoundaryErrorCode(value) {
  return dateValidation.getBoundaryErrorCode(value, dates.dateRange);
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

  const hasDateErrors = dateFields.some(name => errors[name]);
  const startDate = parseDate(model['date-from']);
  const endDate = parseDate(model['date-to']);
  let hasInvalidBoundaries = false;

  if (!hasDateErrors) {
    dateFields.forEach(name => {
      const boundaryError = getBoundaryErrorCode(model[name]);
      if (boundaryError) {
        errors[name] = boundaryError;
        hasInvalidBoundaries = true;
      }
    });
  }

  const hasInvalidRange = !hasDateErrors && !hasInvalidBoundaries && startDate.isAfter(endDate, 'day');
  const exceedsMaximumRange = !hasDateErrors && !hasInvalidBoundaries && !hasInvalidRange &&
    endDate.isAfter(startDate.clone().add(6, 'months'), 'day');

  if (hasInvalidRange) {
    errors['date-to'] = 'dateIsAfter';
  } else if (exceedsMaximumRange) {
    errors['date-to'] = 'maximumDateRange';
  }

  return {
    isValid: Object.keys(errors).length === 0,
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
