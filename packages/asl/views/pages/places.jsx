const React = require('react');
const filterSettings = require('../../src/helpers/filters');
const Filters = require('../containers/filters');
const PlacesTable = require('../containers/places-table');
const ExportLink = require('../containers/export-link');

const Places = ({
  establishment
}) => (
  <React.Fragment>
    <h2 className="headline">{establishment.name}</h2>
    <h1>Licensed premises</h1>
    <Filters filters={filterSettings} />
    <PlacesTable />
    <ExportLink />
  </React.Fragment>
);

module.exports = Places;
