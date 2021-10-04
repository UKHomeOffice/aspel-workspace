import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import omit from 'lodash/omit';
import { Link, Search, Snippet } from '@asl/components';

const ProjectToggle = ({ type }) => {
  if (!type.match(/^projects/)) {
    return null;
  }
  return <p>
    <Link
      page="search"
      searchType={type === 'projects' ? 'projects-content' : 'projects'}
      label={<Snippet>{`searchPanel.projectToggle.${type}`}</Snippet>}
    />
  </p>;
};

const ClearLink = ({ type }) => {
  const { filters } = useSelector(state => state.datatable);
  const query = { filters: omit(filters.active, '*') };

  return <div className="govuk-grid-column-one-third">
    <div className="view-all-link">
      <Link
        page="search"
        searchType={type}
        query={query}
        label={<Snippet>{`searchPanel.clearSearch`}</Snippet>}
      />
    </div>
  </div>;
};

export default function SearchPanel(props) {
  return (
    <Fragment>
      <h2 id="search-title"><Snippet>{`searchPanel.${props.searchType}.title`}</Snippet></h2>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <Search
            action={props.action}
            name="filter-*"
            label={<Snippet>{`searchPanel.${props.searchType}.label`}</Snippet>}
            query={{ sort: null, page: 1 }}
          />
          <ProjectToggle type={props.searchType} />
        </div>
        <ClearLink type={props.searchType} />
      </div>
    </Fragment>
  );
}

SearchPanel.defaultProps = {
  searchType: 'establishments',
  action: ''
};
