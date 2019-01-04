import React, { Component } from 'react';
import { Search, Snippet } from '@asl/components';

class SearchPanel extends Component {
  render() {
    const searchableModels = this.props.searchableModels;
    const searchType = this.props.searchType || searchableModels[0];
    const action = this.props.action;

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
            <Search action={action} name="filter-*" />
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

  // action should only be provided if the search is being submitted to a page other than the current page
  action: undefined
};

export default SearchPanel;
