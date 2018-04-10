import React from 'react';
import { format } from '../../src/helpers/query-string';

const ExportLink = ({
  filter
}) => (
  <p>
    <a href={`?${format({ filter, pdf: 1 })}`}>Export as PDF</a>
  </p>
);

module.exports = ExportLink;
