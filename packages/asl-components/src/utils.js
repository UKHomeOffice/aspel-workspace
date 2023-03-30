const { stringify, parse } = require('qs');
const get = require('lodash/get');
const url = require('url');

const getValue = ({ row, schema, key }) => {
  const accessor = schema.accessor || key;
  if (typeof accessor === 'function') {
    return accessor(row);
  }
  return get(row, accessor);
};

const queryStringFromState = ({
  datatable: {
    filters: {
      active: filters
    },
    sort,
    pagination: {
      page
    }
  }
}) => {
  const currentQueryString = url.parse(window.location.href).query;
  const currentQueryParams = parse(currentQueryString);

  sort = sort.column ? sort : undefined;
  // display page as 1 indexed in browser query string
  page = page + 1;

  return stringify({ ...currentQueryParams, filters, sort, page });
};

const getSort = (column, state) => ({
  column,
  ascending: state.column === column ? !state.ascending : true
});

module.exports = {
  getValue,
  queryStringFromState,
  getSort
};
