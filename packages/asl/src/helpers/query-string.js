const qs = require('qs');
const url = require('url');

const format = filters => {
  if (!filters.textFilter) {
    filters = { filterBy: filters.filterBy };
  }
  return qs.stringify(filters);
};

const parse = href => qs.parse(url.parse(href).query);

module.exports = {
  parse,
  format
};
