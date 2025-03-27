import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import {format as formatDate} from 'date-fns';
import { dateFormat } from '@asl/pages/constants';
import {
  Search,
  Datatable,
  LinkFilter,
  Snippet,
  Link,
  Header,
  Tabs
} from '@ukhomeoffice/asl-components';

const formatters = {
  name: {
    format: (name, person) => <Link page="globalProfile" profileId={person.id} label={`${person.firstName} ${person.lastName}`} />
  },
  assignedRoles: {
    format: roles => roles.sort().join(', ')
  },
  removedAt: {
    format: removedAt => formatDate(removedAt, dateFormat.datetime)
  }
};

export default function StaffDirectory() {
  const { asruStatus } = useSelector(state => state.static.query);
  const tabs = ['current', 'former'];

  return (
    <Fragment>
      <Header
        title={<Snippet>page.title</Snippet>}
        subtitle={<Snippet>page.subtitle</Snippet>}
      />

      <Tabs active={tabs.indexOf(asruStatus)}>
        {
          tabs.map(tab =>
            <Link page="asruProfilesList" key={tab} query={{asruStatus: tab}} label={<Snippet>{`tabs.${tab}`}</Snippet>} />
          )
        }
      </Tabs>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <Search label={<Snippet>search</Snippet>} />
        </div>
        <div className="govuk-grid-column-one-third">
          <div className="view-all-link">
            <Link page="asruProfilesList" label="Clear search" />
          </div>
        </div>
      </div>

      {
        asruStatus === 'current' &&
          <LinkFilter prop="asruRoles" formatter={filter => <Snippet>{`filters.${filter}`}</Snippet>} />
      }

      <Datatable formatters={formatters} />
    </Fragment>
  );
}
