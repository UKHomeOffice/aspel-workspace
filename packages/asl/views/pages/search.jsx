const React = require('react');
const PropTypes = require('prop-types');

const Input = require('govuk-react-components/components/forms/input-text');

const Filters = require('../containers/filters');
const PlacesTable = require('../components/places-table');
const ExportLink = require('../components/export-link');

const Places = ({
  establishment,
  places,
  textFilter,
  setTextFilter
}) => (
  <React.Fragment>
    <h2 className="headline">{establishment.name}</h2>
    <h1>Licensed premises</h1>
    <Filters page="search" />
    <div className="text-filter">
      <Input
        name="filter"
        onChange={(e) => setTextFilter(e.target.value)}
        label="Search"
        value={textFilter}
      />
    </div>
    <PlacesTable rows={places} />
    <ExportLink />
  </React.Fragment>
);

Places.propTypes = {
  establishment: PropTypes.object.isRequired,
  places: PropTypes.array.isRequired
};

module.exports = Places;
