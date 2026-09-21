const moment = require('moment');

const ASPEL_DATA_START_DATE = '2019-07-31';
const DATE_FORMATS = ['YYYY-MM-DD', 'YYYY-M-D'];
const dateFields = ['startDate', 'endDate'];

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
  return moment(value, DATE_FORMATS, true);
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
  return dateFields.reduce((model, name) => ({
    ...model,
    [name]: getDateQueryValue(query, name)
  }), {});
}

function hasBoundaryError(value) {
  const date = parseDate(value);

  return date.isAfter(moment(), 'day') || date.isBefore(ASPEL_DATA_START_DATE, 'day');
}

function validateNtsDateRangeQuery(query) {
  const model = getNtsDateRangeModel(query);
  const errors = dateFields.reduce((fieldErrors, name) => {
    const error = getDateError(query, name);
    return error ? { ...fieldErrors, [name]: error } : fieldErrors;
  }, {});

  const hasDateErrors = Object.keys(errors).length > 0;
  const startDate = parseDate(model.startDate);
  const endDate = parseDate(model.endDate);
  const hasInvalidBoundaries = !hasDateErrors && (hasBoundaryError(model.startDate) || hasBoundaryError(model.endDate));
  const hasInvalidRange = !hasDateErrors && startDate.isAfter(endDate, 'day');

  return {
    isValid: !hasDateErrors && !hasInvalidBoundaries && !hasInvalidRange,
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
