const React = require('react');
const { size, map } = require('lodash');

const CheckboxGroup = require('govuk-react-components/components/forms/radio-group');

const MoreLink = require('./more-link');
const filters = require('../../src/helpers/filters');

const Filters = ({
  uniqueByType,
  collapsed,
  clickMore,
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
          map(uniqueByType, (values, key) => {
            const total = values.length;
            const filter = filters[key];
            if (total > 4 && collapsed[key]) {
              values.splice(4);
            }
            return <div key={ key } className={ columnClass }>
              <CheckboxGroup
                name={ key }
                type="checkbox"
                label={ filter.title }
                options={ values.map(value => ({ value, label: filter.label ? filter.label(value) : value })) }
                value={ filterBy[key] }
                onChange={ e => toggleFilter(key, e.target.value) }
              />
                {
                  total > 4 &&
                  <MoreLink
                    id={key}
                    handleClick={clickMore}
                    collapsed={collapsed[key]}
                  />
                }
              </div>
          })
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
