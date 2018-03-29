const {
  every,
  isEmpty,
  reduce
} = require('lodash');
const filterHelpers = require('../helpers/filters');

// TODO: Make this better
const uniqueByType = (places = [], page) => {
  const arr = ['site', 'suitability', 'holding'];
  if (page === 'search') {
    arr.shift();
  }
  return arr.reduce((obj, cat) =>
    ({ ...obj,
      [cat]: places.map(r => r[cat])
        .reduce((list, values) => list.concat(values), [])
        .reduce((list, value) => list.includes(value) ? list : list.concat(value), [])
    }), {});
};

const matchesHelper = (filter, row, key, values) => {
  if (!values.length) {
    return true;
  }
  if (filter.combines === 'AND') {
    return values.reduce((matched, value) => {
      return matched && filter.match(row[key], value);
    }, true);
  }
  return values.reduce((matched, value) => {
    return matched || filter.match(row[key], value);
  }, false);
};

// TODO: make this better
const searchData = (rows, filter) => {
  if (!filter) {
    return rows;
  }
  return rows.filter(row =>
    row.site.toLowerCase().includes(filter) ||
    row.area.toLowerCase().includes(filter) ||
    row.name.toLowerCase().includes(filter)
  );
};

const filterData = (rows, filters) => {
  if (every(filters, isEmpty)) {
    return rows;
  }
  return rows.filter(row =>
    reduce(filterHelpers, (matches, filter, key) =>
      matches && matchesHelper(filter, row, key, filters[key]), true)
  );
};

const all = (state = [], action) => {
  return state;
};

all.uniqueByType = uniqueByType;
all.filterData = filterData;
all.searchData = searchData;
module.exports = all;
