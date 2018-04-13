import React from 'react';
import { stringify } from 'qs';

const ExportLink = ({
  filter,
  sort
}) => (
  <p>
    Export as <a href={`?${stringify({ filter, sort, format: 'pdf' })}`}>PDF</a> | <a href={`?${stringify({ filter, sort, format: 'csv' })}`}>CSV</a>
  </p>
);

module.exports = ExportLink;
