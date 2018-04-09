const React = require('react');
const filterSettings = require('../../src/helpers/filters');
const Filters = require('../containers/filters');
const PlacesTable = require('../containers/places-table');
const ExportLink = require('../containers/export-link');
const TextFilter = require('../containers/text-filter');

const Places = ({
  establishment,
  isScreen
}) => (
  <React.Fragment>
    <h2 className="headline">{establishment.name}</h2>
    <h1>Licensed premises</h1>
    { isScreen && (
      <React.Fragment>
        <Filters filters={filterSettings.filter(f => f.key !== 'site')} />
        <TextFilter />
      </React.Fragment>
    )}
    <PlacesTable />
    { isScreen && <ExportLink /> }
  </React.Fragment>
);

module.exports = Places;
