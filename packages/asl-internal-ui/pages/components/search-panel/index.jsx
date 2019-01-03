import React, { Component } from 'react';
import { Search, Snippet } from '@asl/components';

class SearchPanel extends Component {
  render() {
    const searchableModels = this.props.searchableModels;
    const searchType = this.props.searchType || searchableModels[0];

    return (
      <div className="search-panel">
        <h2><Snippet>searchPanel.title</Snippet></h2>

        <ul className="search-type">
          { searchableModels.map(model => (
            <li key={model}>
              <a href={`/search/${model}`} className={searchType === model ? 'active' : ''}>
                <Snippet>{`searchPanel.${model}.label`}</Snippet>
              </a>
            </li>
          )) }
        </ul>

        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <Search />
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
  searchableModels: ['establishments', 'profiles', 'projects']
};

export default SearchPanel;
