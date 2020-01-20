import React from 'react';
import { useSelector } from 'react-redux';
import { stringify } from 'qs';
import get from 'lodash/get';

export default function CSVDownloadLink ({ label = 'Download this data (.csv)' }) {
  const query = useSelector(state => {
    const filters = get(state, 'datatable.filters.active');
    const sort = get(state, 'datatable.sort');
    return { filters, sort, csv: 1 };
  });
  return <a href={`?${stringify(query)}`} className="download">{ label }</a>;
}
