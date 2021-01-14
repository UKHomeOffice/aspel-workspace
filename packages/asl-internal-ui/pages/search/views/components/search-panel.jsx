import React, { Fragment } from 'react';
import { Search, Snippet } from '@asl/components';

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
        </div>
        {
          (props.searchType !== 'projects-content') && <div className="govuk-grid-column-one-third">
            <div className="view-all-link">
              <a href={`/search/${props.searchType}`}>
                <Snippet>{`searchPanel.viewAll`}</Snippet>
              </a>
            </div>
          </div>
        }
      </div>
    </Fragment>
  );
}

SearchPanel.defaultProps = {
  searchType: 'establishments',
  action: ''
};
