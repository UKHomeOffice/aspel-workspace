const {
  every,
  some,
  isEmpty
} = require('lodash');
const filterSettings = require('../helpers/filters');

const matchesHelper = (filter, row, values) => {
  if (!values.length) {
    return true;
  }
  if (filter.combines === 'AND') {
    return every(values, value => filter.match(row[filter.key], value));
  }
  return some(values, value => filter.match(row[filter.key], value));
};

// TODO: make this better
const searchData = (rows, filter = '') => {
  if (!filter) {
    return rows;
  }
  filter = filter.toLowerCase();
  return rows.filter(row =>
    row.site.toLowerCase().includes(filter) ||
    row.area.toLowerCase().includes(filter) ||
    row.name.toLowerCase().includes(filter)
  );
};

const filterData = (rows, values) => {
  if (every(values, isEmpty)) {
    return rows;
  }
  return rows.filter(row =>
    filterSettings.reduce((matches, filter) =>
      matches && matchesHelper(filter, row, values[filter.key]), true)
  );
};

const places = (state = [], action) => {
  return state;
};

places.filterData = filterData;
places.searchData = searchData;
module.exports = places;
