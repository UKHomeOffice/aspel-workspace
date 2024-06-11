import React from 'react';
import { useSelector } from 'react-redux';
import { stringify } from 'qs';
import get from 'lodash/get';

export default function CSVDownloadLink ({ label = 'Download this data (.csv)', query = {} }) {
    const querystring = useSelector(state => {
        const filters = get(state, 'datatable.filters.active');
        const sort = get(state, 'datatable.sort');
        return { filters, sort, csv: 1, ...query };
    });
    return <a href={`?${stringify(querystring)}`} className="download">{ label }</a>;
}
