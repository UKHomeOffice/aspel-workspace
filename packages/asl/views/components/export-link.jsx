const React = require('react');
const { format } = require('../../src/helpers/query-string');

const ExportLink = ({
  filterBy,
  filterText
}) => (
  <p>
    <a href={`?${format({ filterBy, filterText, pdf: 1 })}`}>Export as PDF</a>
  </p>
);

module.exports = ExportLink;
