const { get, isEqual, mapValues } = require('lodash');
const striptags = require('striptags');

const toTitleCase = str =>
  str.replace(/\w\S*/g, txt => `${txt.charAt(0).toUpperCase()}${txt.substr(1)}`);

const getTitle = (key, options = {}) => {
  if (options.title) {
    if (typeof options.title === 'function') {
      return options.title(key);
    }
    return options.title;
  }
  return toTitleCase(key);
};

const getValue = ({ row, schema, key }) => {
  const accessor = schema.accessor || key;
  if (typeof accessor === 'function') {
    return accessor(row);
  }
  return get(row, accessor);
};

const hasChanged = ({ accessor }, newValue, oldValue) => {
  oldValue = get(oldValue, accessor, oldValue);
  if (Array.isArray(newValue)) {
    return !isEqual([ ...newValue ].sort(), [ ...oldValue ].sort());
  }
  return newValue !== oldValue;
};

const cleanModel = model => mapValues(model, field => {
  if (typeof field === 'string') {
    return striptags(field);
  }
  return field;
});

module.exports = {
  toTitleCase,
  getTitle,
  getValue,
  hasChanged,
  cleanModel
};
