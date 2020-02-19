import React, { Component } from 'react';
import { stringify } from 'qs';
import { Search, Snippet } from '@asl/components';

class SearchPanel extends Component {
  render() {
    const searchableModels = this.props.searchableModels;
    const searchType = this.props.searchType || searchableModels[0];
    const query = stringify({ filters: this.props.searchTerm });
    return (
      <div className="search-panel">
        <h2><Snippet>searchPanel.title</Snippet></h2>

        <ul className="search-type">
          { searchableModels.map(model => (
            <li key={model}>
              <a href={`/search/${model}?${query}`} className={searchType === model ? 'active' : ''}>
                <Snippet>{`searchPanel.${model}.label`}</Snippet>
              </a>
            </li>
          )) }
        </ul>

        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <Search action={this.props.action} name="filter-*" />
          </div>

          <div className="govuk-grid-column-one-third">
            <div className="view-all-link">
              <a href={`/search/${searchType}`}>
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
  searchableModels: ['establishments', 'profiles', 'projects'],
  action: ''
};

export default SearchPanel;
