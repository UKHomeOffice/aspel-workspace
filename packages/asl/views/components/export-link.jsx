import React from 'react';
import { format } from '../../src/helpers/query-string';

const ExportLink = ({
  filter
}) => (
  <p>
    Export as <a href={`?${format({ filter, format: 'pdf' })}`}>PDF</a> | <a href={`?${format({ filter, format: 'csv' })}`}>CSV</a>
  </p>
);

module.exports = ExportLink;
