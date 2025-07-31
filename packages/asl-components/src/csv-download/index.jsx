import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { stringify } from 'qs';
import get from 'lodash/get';
import { createSelector } from 'reselect';

// Memoised selector using reselect
const selectCsvParams = createSelector(
    state => get(state, 'datatable.filters.active'),
    state => get(state, 'datatable.sort'),
    (filters, sort) => ({ filters, sort })
);

export default function CSVDownloadLink({ label = 'Download this data (.csv)', query = {} }) {
    const { filters, sort } = useSelector(selectCsvParams);

    const querystring = useMemo(() => ({
        filters,
        sort,
        csv: 1,
        ...query
    }), [filters, sort, query]);

    return <a href={`?${stringify(querystring)}`} className="download">{label}</a>;
}
