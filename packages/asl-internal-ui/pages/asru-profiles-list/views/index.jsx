import React, { Fragment } from 'react';
import {
  Search,
  Datatable,
  LinkFilter,
  Snippet,
  Link,
  Header
} from '@asl/components';

const formatters = {
  name: {
    format: (name, person) => <Link page="globalProfile" profileId={person.id} label={`${person.firstName} ${person.lastName}`} />
  },
  assignedRoles: {
    format: roles => roles.sort().join(', ')
  }
};

export default function AsruProfilesList() {
  return (
    <Fragment>
      <Header
        title={<Snippet>page.title</Snippet>}
        subtitle={<Snippet>page.subtitle</Snippet>}
      />

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

      <LinkFilter prop="asruRoles" formatter={filter => <Snippet>{`filters.${filter}`}</Snippet>} />
      <Datatable formatters={formatters} />
    </Fragment>
  );
}
