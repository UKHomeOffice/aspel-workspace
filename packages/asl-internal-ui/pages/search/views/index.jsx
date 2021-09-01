import React from 'react';
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
import ProjectsFilters from './components/filters';
import formatters from '../formatters';

function uppercaseFirst(str) {
  return `${str[0].toUpperCase()}${str.substring(1)}`;
}

function projectStatusFormatter(status) {
  if (status === 'inactive') {
    return 'Draft';
  }
  if (status === 'all-inactive') {
    return 'Inactive';
  }
  return uppercaseFirst(status);
}

export default function Index () {
  const { profile, searchType } = useSelector(state => state.static);
  const { filters, pagination } = useSelector(state => state.datatable);

  const searchTerm = filters.active;
  const count = pagination.count;
  const statusFilters = (filters.options.find(f => f.key === 'status') || {}).values;
  const hasFilters = searchType !== 'projects-content' && !!statusFilters.length;

  // eslint-disable-next-line no-sparse-arrays
  const tabs = [, 'establishments', 'profiles', 'projects'];
  const selectedTab = searchType === 'projects-content' ? 3 : tabs.indexOf(searchType);
  const resultType = searchType === 'profiles' ? 'people' : searchType;
  const searchString = searchTerm && searchTerm['*'] && searchTerm['*'][0];
  const queryWithCSV = { filters: searchTerm, csv: true };

  return (
    <div className="search">
      <Header title={<Snippet name={profile.firstName}>pages.dashboard.greeting</Snippet>} />
      <DashboardNavigation tab={selectedTab} />
      <SearchPanel searchType={searchType} searchTerm={searchTerm} />
      <div className="flex">
        {
          searchType === 'projects-content' && <ProjectsFilters />
        }
        <div className="grow">
          {
            searchType === 'profiles' && <LinkFilter
              prop="establishments"
              label={<Snippet>filter.label</Snippet>}
              options={['unassociated']}
              showAll={{ position: 'before', label: 'Show all' }}
              formatter={uppercaseFirst}
            />
          }
          {
            hasFilters && <LinkFilter
              prop="status"
              label="Filter by status:"
              showAll={{ position: 'after', label: 'Show all' }}
              formatter={projectStatusFormatter}
            />
          }
          {
            searchType === 'projects-content' && <Link page="search" searchType={searchType} label="Download CSV" query={queryWithCSV} className="float-right" />
          }
          <FilterSummary
            resultType={resultType === 'projects-content' ? 'projects' : resultType}
            filteredLabel={<Snippet count={count} searchTerm={searchString}>{`results.filtered.${count === 1 ? 'singular' : 'plural'}`}</Snippet>}
          />
          <Datatable formatters={formatters[searchType]} className={searchType} />
        </div>
      </div>
      {
        searchType === 'establishments' && (
          <Link page="createEstablishment" label={<Snippet>actions.establishment.create</Snippet>} className="govuk-button button-secondary" />
        )
      }

    </div>
  );
}
