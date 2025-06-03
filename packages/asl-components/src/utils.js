const { stringify, parse } = require('qs');
const get = require('lodash/get');
const url = require('url');
const { format: dateFormatter } = require('date-fns');

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

const DATE_FORMAT = {
    long: 'd MMMM yyyy',
    short: 'd/M/yyyy'
};

const formatDate = (date, format = DATE_FORMAT.long) => {
    try {
        return date ? dateFormatter(date, format) : '-';
    } catch (err) {
        return 'Invalid date entered';
    }
};

function applyFormatters({ formatters, name, ...props })  {
    const formatter = formatters?.[name];

    const formatted = formatter?.propMappers && typeof formatter?.propMappers === 'object'
        ? Object.fromEntries(
            Object.entries(formatters[name].propMappers)
                .map(([key, mapper]) => [key, mapper(props[key], formatter)])
        )
        : {};

    return {
        formatters,
        name,
        ...props,
        ...formatted
    };
}

module.exports = {
    getValue,
    queryStringFromState,
    getSort,
    formatDate,
    DATE_FORMAT,
    applyFormatters,
};
