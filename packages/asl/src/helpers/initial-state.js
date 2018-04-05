const { merge } = require('lodash');
const filters = require('../reducers/filters');

module.exports = (data = {}, { filterBy = {}, textFilter = '', pdf = false } = {}) => ({
  ...data,
  filters: {
    filterBy: merge(filters.filterBy(undefined, {}), filterBy),
    textFilter
  },
  pdf
});
