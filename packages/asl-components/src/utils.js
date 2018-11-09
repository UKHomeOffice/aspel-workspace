import { stringify } from 'qs';
import get from 'lodash/get';

export const getValue = ({ row, schema, key }) => {
  const accessor = schema.accessor || key;
  if (typeof accessor === 'function') {
    return accessor(row);
  }
  return get(row, accessor);
};

export const queryStringFromState = ({
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
  sort = sort.column ? sort : undefined;
  // display page as 1 indexed in browser query string
  page = page + 1;
  return stringify({ filters, sort, page });
};

export const getSort = (column, state) => ({
  column,
  ascending: state.column === column ? !state.ascending : true
});
