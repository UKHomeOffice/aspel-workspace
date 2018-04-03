const React = require('react');
const { size } = require('lodash');

const FilterColumn = require('./filter-column');

const Filters = ({
  toggleFilter,
  filterBy,
  filters,
  clearFilters
}) => {

  const columnClass = [null, 'column-full', 'column-half', 'column-one-third'][size(filters)];

  return (
    <div className="filter-panel">
      <h3>Filter by</h3>
      <div className="grid-row">
        {
          filters.map((filter) =>
            <FilterColumn
              key={ filter.key }
              id={ filter.key }
              title={ filter.title }
              label={ filter.label }
              values={ filter.values }
              columnClass={ columnClass }
              currentFilters={ filterBy[filter.key] }
              handleOnChange={ e => toggleFilter(filter.key, e.target.value) }
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
  );
};

module.exports = Filters;
