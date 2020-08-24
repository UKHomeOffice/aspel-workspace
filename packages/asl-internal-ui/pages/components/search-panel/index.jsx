import React, { Component } from 'react';
import { stringify } from 'qs';
import { Search, Snippet } from '@asl/components';

class SearchPanel extends Component {
  render() {
    const searchableModels = this.props.searchableModels;
    const searchType = this.props.searchType || searchableModels[0].name;

    searchableModels.forEach(model => {
      model.query = stringify({ filters: model.defaultFilters });
      model.queryWithSearchTerm = stringify({
        filters: Object.assign({}, {
          ...this.props.searchTerm,
          ...model.defaultFilters
        })
      });
    });

    return (
      <div className="search-panel">
        <h2 id="search-title"><Snippet>searchPanel.title</Snippet></h2>

        <ul className="search-type">
          { searchableModels.map(model => (
            <li key={model.name}>
              <a href={`/search/${model.name}?${model.queryWithSearchTerm}`} className={searchType === model.name ? 'active' : ''}>
                <Snippet>{`searchPanel.${model.name}.label`}</Snippet>
              </a>
            </li>
          )) }
        </ul>

        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <Search action={this.props.action} name="filter-*" labelledBy="search-title" />
          </div>

          <div className="govuk-grid-column-one-third">
            <div className="view-all-link">
              <a href={`/search/${searchType}?${searchableModels.find(m => m.name === searchType).query}`}>
                <Snippet>{`searchPanel.${searchType}.viewAll`}</Snippet>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
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

export default SearchPanel;
