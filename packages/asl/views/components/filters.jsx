const React = require('react');
const { size, map } = require('lodash');

const FilterColumn = require('./filter-column');
const MoreLink = require('./more-link');

const Filters = ({
  uniqueByType,
  toggleFilter,
  filterBy,
  clearFilters
}) => {
  if (!uniqueByType || !size(uniqueByType)) {
    return null;
  }

  const columnClass = [null, 'column-full', 'column-half', 'column-one-third'][size(uniqueByType)];

  return (
    <div className="filter-panel">
      <h3>Filter by</h3>
      <div className="grid-row">
        {
          map(uniqueByType, (values, key) =>
            <FilterColumn
              key={ key }
              id={ key }
              values={ values }
              columnClass={ columnClass }
              currentFilters={ filterBy[key] }
              handleOnChange={ e => toggleFilter(key, e.target.value) }
            />
          )
        }
      </div>
      <p className="control-bar">
        <a href="#" onClick={e => {
          e.preventDefault();
          clearFilters();
        }}>Clear filters</a>
      </p>
    </div>
  )
}

module.exports = Filters;
