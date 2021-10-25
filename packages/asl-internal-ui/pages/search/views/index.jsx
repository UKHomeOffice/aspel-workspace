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
import ContentSearchSummary from './components/content-search-summary';
import DashboardNavigation from '../../components/dashboard-navigation';
import ProjectsFilters from './components/filters';
import formatters from '../formatters';
import TaskSearchResult, { hasProjectTitleMatch } from './components/task-search-result';

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
  const showStatusFilter = !['projects-content', 'tasks'].includes(searchType) && !!statusFilters.length;

  const tabs = ['tasks', 'establishments', 'profiles', 'projects'];
  const selectedTab = searchType === 'projects-content' ? 3 : tabs.indexOf(searchType);
  const resultType = searchType === 'profiles' ? 'people' : searchType;
  const searchString = searchTerm && searchTerm['*'] && searchTerm['*'][0];
  const queryWithCSV = { filters: searchTerm, csv: true };

  const modelFilters = {
    pil: 'PIL',
    project: 'PPL',
    establishment: 'PEL',
    profile: 'Profile'
  };

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
            searchType === 'tasks' &&
              <div className="task-filters">
                <p>Filter results:</p>
                <LinkFilter
                  prop="progress"
                  label="By task status:"
                  options={['open', 'closed']}
                  showAll={{ position: 'after', label: 'All tasks' }}
                  formatter={uppercaseFirst}
                />
                <LinkFilter
                  prop="model"
                  label="By category:"
                  options={Object.keys(modelFilters)}
                  showAll={{ position: 'before', label: 'All' }}
                  formatter={filter => modelFilters[filter]}
                />
              </div>
          }

          {
            showStatusFilter && <LinkFilter
              prop="status"
              label="Filter by status:"
              showAll={{ position: 'after', label: 'Show all' }}
              formatter={projectStatusFormatter}
            />
          }

          <div className="govuk-grid-row">
            <div className="govuk-grid-column-three-quarters">
              {
                resultType === 'projects-content'
                  ? <ContentSearchSummary count={count} searchTerm={searchTerm} />
                  : <FilterSummary
                    resultType={resultType}
                    filteredLabel={<Snippet count={count} searchTerm={searchString}>{`results.filtered.${count === 1 ? 'singular' : 'plural'}`}</Snippet>}
                  />
              }
            </div>
            <div className="govuk-grid-column-one-quarter">
              {
                searchType === 'projects-content' &&
                  <Link page="search" searchType={searchType} label="Download results (CSV)" query={queryWithCSV} className="float-right" />
              }
            </div>
          </div>

          {
            searchType === 'tasks'
              ? <Datatable
                formatters={formatters[searchType]}
                className={searchType}
                Expandable={TaskSearchResult}
                expands={hasProjectTitleMatch}
                alwaysExpanded={true}
              />
              : <Datatable formatters={formatters[searchType]} className={searchType} />
          }
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
