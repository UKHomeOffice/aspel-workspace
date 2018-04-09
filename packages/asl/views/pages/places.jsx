const React = require('react');
const PropTypes = require('prop-types');
const filterSettings = require('../../src/helpers/filters');
const Filters = require('../containers/filters');
const PlacesTable = require('../components/places-table');
const ExportLink = require('../containers/export-link');

const Places = ({
  places,
  establishment,
  applyButton,
  screen
}) => (
  <React.Fragment>
    <h2 className="headline">{establishment.name}</h2>
    <h1>Licensed premises</h1>
    { screen && <Filters filters={filterSettings} /> }
    <PlacesTable rows={places} />
    { screen && <ExportLink /> }
  </React.Fragment>
);

Places.propTypes = {
  establishment: PropTypes.object.isRequired,
  places: PropTypes.array.isRequired,
  applyButton: PropTypes.bool.isRequired
};

module.exports = Places;
