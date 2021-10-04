import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import omit from 'lodash/omit';
import merge from 'lodash/merge';
import { Link, Snippet } from '@asl/components';

export default function ContentSearchSummary({ count, searchTerm }) {
  const searchString = get(searchTerm, '*[0]');
  const selectedFilters = Object.values(omit(searchTerm, '*')).flat();
  const content = useSelector(state => state.static.content);
  const filterLabels = merge({}, ...Object.keys(content.filters).map(filterName => content.filters[filterName].options).filter(Boolean));

  return (
    <div className="content-search-summary">
      <p className="result-count">
        <Snippet count={count}>{`results.filtered.${count === 1 ? 'singular' : 'plural'}`}</Snippet>
      </p>
      { searchString && <span className="summary"><strong>Search term:</strong> <span className="search-term">{searchString}</span></span> }
      { selectedFilters.length > 0 &&
        <Fragment>
          <span className="summary">
            <strong>Filters selected:</strong>
            {selectedFilters.map(filter => (
              <span key={filter} className="active-filter">{filterLabels[filter] || filter}</span>
            ))}
          </span>
          <Link page="search" searchType={'projects-content'} label={<Snippet>{`searchPanel.clearAll`}</Snippet>} />
        </Fragment>
      }
    </div>
  );
}
