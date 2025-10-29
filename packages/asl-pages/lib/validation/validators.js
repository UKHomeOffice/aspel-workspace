const { isUndefined, isNull, every, castArray, some, zip } = require('lodash');
const moment = require('moment');

function normaliseDate(dateSpec, values, model) {
  if (typeof dateSpec === 'function') {
    return dateSpec(values, model);
  } else if (dateSpec === 'now' || dateSpec == null) {
    return moment();
  } else {
    return zip(dateSpec.split('-'), [4, 2, 2])
      .map(([part, length]) => part.padStart(length, '0'))
      .join('-');
  }
}

// noinspection JSUnusedGlobalSymbols
const validators = {
  type: (field, value, type) => {
    if (isUndefined(value) || isNull(value)) {
      return true;
    }
    switch (type) {
      case 'array':
        return Array.isArray(value);
      case 'object':
        return !Array.isArray(value) && typeof value === 'object';
      case 'number':
        return typeof value === 'number' && !Number.isNaN(value);
      case 'string':
        return typeof value === 'string';
    }
    return false;
  },
  required: (field, formValue, params, values, model, fieldSpec) => {
    const value = params?.valFromModel && !formValue
      ? model[field]
      : formValue;

    if (Array.isArray(value)) {
      return !!value.length;
    }
    if (fieldSpec.inputType === 'inputDate') {
      return value != null && value.toString().replaceAll(/[-0]/g, '').length > 0;
    }
    return value !== null && value !== '' && !isUndefined(value);
  },
  customValidate: (field, value, condition, values, model) => {
    return !!condition(value, values, model);
  },
  email: (field, value) => {
    return value.match(/[a-z0-9.]+@[a-z0-9.]+/i);
  },
  minLength: (field, value, length) => {
    return isNull(value) ||
      (!isUndefined(value) && value.length >= length);
  },
  maxLength: (field, value, length) => {
    return !value || `${value}`.length <= length;
  },
  match: (field, value, regex) => {
    return !!(value.match && value.match(regex));
  },
  matchesField: (field, value, matchField, values) => {
    return value === values[matchField];
  },
  definedValues: (field, value, definedValues) => {
    if (value === undefined) {
      return true;
    }
    if (Array.isArray(value)) {
      return every(value, val => definedValues.includes(val));
    }
    return definedValues.includes(value);
  },
  validDate: (field, value) => {
    if (!value.match(/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/)) {
      return false;
    }
    return isNull(value) || moment(value, 'YYYY-MM-DD').isValid();
  },
  lessThanOrEqualToMaxWordCount(fieldName, value, params, values, model, field) {
    return value?.split(/\s+/).filter(Boolean).length <= field.maxWordCount;
  },
  dateIsAfter(field, value, date, values, model) {
    return isNull(value) ||
      moment(value, 'YYYY-MM-DD').isAfter(normaliseDate(date, values, model));
  },
  dateIsSameOrAfter(field, value, date, values, model) {
    return isNull(value) ||
      moment(value, 'YYYY-MM-DD').isSameOrAfter(normaliseDate(date, values, model));
  },
  dateIsBefore(field, value, date, values, model) {
    return isNull(value) ||
      moment(value, 'YYYY-MM-DD').isBefore(normaliseDate(date, values, model));
  },
  dateIsSameOrBefore(field, value, date, values, model) {
    const threshold = normaliseDate(date, values, model);
    return isNull(value) ||
      moment(value, 'YYYY-MM-DD').isSameOrBefore(threshold);
  },
  // file validation
  fileRequired(field, value) {
    return !!(value && value.length);
  },
  // 5MB
  maxSize(field, value, size = 5e+6) {
    return every(value, file => file.size < size);
  },
  mimeType(field, value, types) {
    return every(value, file => castArray(types).includes(file.mimetype));
  },
  ext(field, value, ext) {
    if (Array.isArray(ext)) {
      return some(ext, e => validators.ext(field, value, e));
    }
    const ra = new RegExp(`\\.${ext}$`);
    return every(value, file => file.originalname.match(ra));
  },
  exclusive(key, value, params, values, model, field) {
    const selected = Array.isArray(value) ? value : [value];
    const hasSelectedExclusiveOption = field.options.find(opt => opt.behaviour === 'exclusive' && selected.includes(opt.value)) !== undefined;

    return !hasSelectedExclusiveOption || selected.length === 1;
  }
};

module.exports = validators;
