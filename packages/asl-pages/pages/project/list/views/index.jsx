import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@ukhomeoffice/react-components';
import {
  Search,
  FilterSummary,
  Datatable,
  Snippet,
  Header,
  Tabs,
  Link,
  LinkFilter,
  LicenceStatusBanner,
  Details,
  Inset
} from '@asl/components';

import formatters from '../../formatters';

const tabs = [
  'active',
  'inactive-statuses',
  'inactive'
];

export default function Projects() {
  const { establishment, status, allowedActions, adminListUrl, query } = useSelector(state => state.static);
  const { count } = useSelector(state => state.datatable.pagination);
  const queryWithCSV = { ...(query || {}), csv: true };

  return (
    <Fragment>
      <LicenceStatusBanner licence={establishment} licenceType="pel" />

      <Header
        title={<Snippet>pages.project.list</Snippet>}
        subtitle={establishment.name}
      />

      {
        !allowedActions.includes('project.read.all') &&
          <Fragment>
            <Details
              className="margin-bottom"
              summary={<Snippet>details.summary</Snippet>}
            >
              <Inset>
                <Snippet adminListUrl={adminListUrl}>details.content</Snippet>
              </Inset>
            </Details>
          </Fragment>
      }

      {
        allowedActions.includes('project.import') && (
          <div className="control-panel projects-actions">
            <form method="POST" action="projects/create">
              <Button><Snippet>buttons.create</Snippet></Button>
            </form>
            <Link page="project.import" className="govuk-button button-secondary" label={<Snippet>buttons.upload</Snippet>} />
          </div>
        )
      }

      <Link page="project.list" label={<Snippet>actions.downloadAll</Snippet>} query={queryWithCSV} className="float-right" />

      <Tabs active={tabs.indexOf(status)}>
        {
          tabs.map((tab, index) =>
            <a key={index} href={`?status=${tab}`}><Snippet fallback={`status.${tab}`}>{`tabs.${tab}`}</Snippet></a>
          )
        }
      </Tabs>

      <Search label={<Snippet>searchText</Snippet>} />

      {
        status === 'inactive-statuses' &&
          <LinkFilter
            prop="retrospective-assessment"
            append={['RA required', 'RA incomplete', 'RA overdue', 'RA complete']}
            showAllLabel="Show all"
          />
      }

      <FilterSummary
        resultType="projects"
        filteredLabel={<Snippet count={count}>{`results.filtered.${count === 1 ? 'singular' : 'plural'}`}</Snippet>}
      />

      <Datatable formatters={formatters(establishment.id)} />
    </Fragment>
  );
}
