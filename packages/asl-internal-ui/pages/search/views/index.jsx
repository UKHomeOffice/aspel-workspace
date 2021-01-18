import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import {
  Datatable,
  FilterSummary,
  Header,
  Link,
  Snippet,
  LinkFilter
} from '@asl/components';
import SearchPanel from './components/search-panel';
import DashboardNavigation from '../../components/dashboard-navigation';
import formatters from '../formatters';

function uppercaseFirst(str) {
  return `${str[0].toUpperCase()}${str.substring(1)}`;
}

export default function Index () {
  const { profile, searchType } = useSelector(state => state.static);
  const { filters, pagination } = useSelector(state => state.datatable);

  const searchTerm = filters.active;
  const count = pagination.count;
  const hasFilters = !!filters.options.length;

  // eslint-disable-next-line no-sparse-arrays
  const tabs = [, 'establishments', 'profiles', 'projects'];
  const selectedTab = searchType === 'projects-content' ? 3 : tabs.indexOf(searchType);
  const showResults = searchType !== 'projects-content' || (searchTerm['*'] && searchTerm['*'][0]);
  const resultType = searchType === 'profiles' ? 'people' : searchType;
  const searchString = searchTerm && searchTerm['*'] && searchTerm['*'][0];
  const queryWithCSV = { filters: searchTerm, csv: true };

  return (
    <div className="search">
      <Header title={<Snippet name={profile.firstName}>pages.dashboard.greeting</Snippet>} />
      <DashboardNavigation tab={selectedTab} />

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <SearchPanel searchType={searchType} searchTerm={searchTerm} />
          {
            showResults && <Fragment>
              {
                searchType === 'profiles' && <LinkFilter
                  prop="establishments"
                  label={<Snippet>filter.label</Snippet>}
                  append={['unassociated']}
                  showAllLabel="Show all"
                  formatter={uppercaseFirst}
                />
              }
              {
                hasFilters && <LinkFilter
                  prop="status"
                  label="Filter by status:"
                  showAllLabel="Show all"
                  showAllBefore={false}
                  formatter={filter => filter === 'transferred' ? 'Transferred out' : uppercaseFirst(filter)}
                />
              }
              {
                searchType === 'projects-content' && <Link page="search" searchType={searchType} label="Download CSV" query={queryWithCSV} className="float-right" />
              }
              <FilterSummary
                resultType={resultType}
                filteredLabel={<Snippet count={count} searchTerm={searchString}>{`results.filtered.${count === 1 ? 'singular' : 'plural'}`}</Snippet>}
              />

              <Datatable formatters={formatters[searchType]} />
            </Fragment>
          }
        </div>
      </div>

      {
        searchType === 'establishments' &&
          <Link page="createEstablishment" label={<Snippet>actions.establishment.create</Snippet>} className="govuk-button button-secondary" />
      }

    </div>
  );
}
