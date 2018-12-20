import React, { Component } from 'react';
import { Link, Search, Snippet } from '@asl/components';

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
              <a href={`/search?searchType=${model}`} className={searchType === model ? 'active' : ''}>
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
              { searchType === 'establishments' &&
                <Link
                  page="establishment.list"
                  label={<Snippet>searchPanel.establishments.viewAll</Snippet>}
                />
              }
              { searchType === 'people' &&
                <Link
                  page="profile.list"
                  label={<Snippet>searchPanel.people.viewAll</Snippet>}
                />
              }
              { searchType === 'projects' &&
                <Link
                  page="project.list"
                  label={<Snippet>searchPanel.projects.viewAll</Snippet>}
                />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SearchPanel.defaultProps = {
  searchableModels: [
    'establishments',
    'people',
    'projects'
  ]
};

export default SearchPanel;
