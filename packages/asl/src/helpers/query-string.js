const { omit } = require('lodash');
const qs = require('qs');
const url = require('url');

const format = filters => {
  if (!filters.filter) {
    filters = omit(filters, 'filter');
  }
  return qs.stringify(filters);
};

const parse = href => qs.parse(url.parse(href).query);

module.exports = {
  parse,
  format
};
