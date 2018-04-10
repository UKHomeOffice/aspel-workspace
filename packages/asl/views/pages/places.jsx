const React = require('react');
const TextFilter = require('../containers/text-filter');
const PlacesTable = require('../containers/places-table');
const ExportLink = require('../containers/export-link');

const Places = ({
  establishment
}) => (
  <React.Fragment>
    <h2 className="headline">{establishment.name}</h2>
    <h1>Licensed premises</h1>
    <TextFilter />
    <PlacesTable />
    <ExportLink />
  </React.Fragment>
);

module.exports = Places;
