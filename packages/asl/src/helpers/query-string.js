const qs = require('qs');
const url = require('url');

const format = filters => {
  if (!filters.textFilter) {
    delete filters.textFilter;
  }
  return qs.stringify(filters);
};

const parse = href => qs.parse(url.parse(href).query);

module.exports = {
  parse,
  format
};
