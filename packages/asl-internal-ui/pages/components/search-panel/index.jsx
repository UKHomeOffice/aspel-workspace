import React, { Fragment } from 'react';
import { stringify } from 'qs';
import { Search, Snippet } from '@asl/components';

export default function SearchPanel(props) {
  const searchableModels = props.searchableModels;
  const searchType = props.searchType || searchableModels[0].name;

  searchableModels.forEach(model => {
    model.query = stringify({ filters: model.defaultFilters });
    model.queryWithSearchTerm = stringify({
      filters: Object.assign({}, {
        ...props.searchTerm,
        ...model.defaultFilters
      })
    });
  });

  return (
    <Fragment>
      <h2 id="search-title"><Snippet>{`searchPanel.${searchType}.title`}</Snippet></h2>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <Search
            action={props.action}
            name="filter-*"
            label={<Snippet>{`searchPanel.${searchType}.label`}</Snippet>}
            query={{ sort: null, page: 1 }}
          />
        </div>

        <div className="govuk-grid-column-one-third">
          <div className="view-all-link">
            <a href={`/search/${searchType}?${searchableModels.find(m => m.name === searchType).query}`}>
              <Snippet>{`searchPanel.${searchType}.viewAll`}</Snippet>
            </a>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

SearchPanel.defaultProps = {
  searchableModels: [
    {
      name: 'establishments',
      defaultFilters: { status: ['active'] }
    },
    {
      name: 'profiles',
      defaultFilters: {}
    },
    {
      name: 'projects',
      defaultFilters: { status: ['active'] }
    }
  ],
  action: ''
};
