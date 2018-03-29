const React = require('react');
const PropTypes = require('prop-types');

const Filters = require('../containers/filters');
const PlacesTable = require('../components/places-table');

const Places = ({
  places,
  establishment,
  applyButton
}) => (
  <React.Fragment>
    <h2 className="headline">{establishment.name}</h2>
    <h1>Licensed premises</h1>
    <Filters
      page="places"
      applyButton={applyButton}
    />
    <PlacesTable rows={places} />
  </React.Fragment>
);

Places.propTypes = {
  establishment: PropTypes.object.isRequired,
  places: PropTypes.array.isRequired,
  applyButton: PropTypes.bool.isRequired
};

module.exports = Places;
