import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import { Datatable, Snippet, Header, Link, LinkFilter, Tabs } from '@asl/components';

const formatters = {
  assignedTo: {
    format: assignedTo => {
      return (assignedTo.id === 'unassigned')
        ? <span>Unassigned tasks</span>
        : <Link page="globalProfile" profileId={assignedTo.id} label={`${assignedTo.firstName} ${assignedTo.lastName}`} />;
    }
  }
};

export default function AsruProfilesList() {
  const { progress } = useSelector(state => state.static);
  const filters = useSelector(state => state.datatable.filters);
  const withAsru = get(filters, 'active.withAsru', []).includes('yes');
  const tabs = ['open', 'closed'];

  return (
    <Fragment>
      <Header
        title={<Snippet>page.title</Snippet>}
        subtitle={<Snippet>page.subtitle</Snippet>}
      />

      <p><Snippet>page.description</Snippet></p>

      <Tabs active={tabs.indexOf(progress)}>
        {
          tabs.map(tab => <Link page="asruWorkload" key={tab} query={{progress: tab}} label={<Snippet>{`tabs.${tab}`}</Snippet>} />)
        }
      </Tabs>

      {
        progress === 'open' &&
          <div className="task-filters">
            <LinkFilter
              prop="withAsru"
              label="Filter by status:"
              options={['yes', 'no']}
              showAll={{ position: 'after', label: 'All tasks' }}
              formatter={filter => <Snippet>{`filters.withAsru.${filter}`}</Snippet>}
            />

            {
              withAsru &&
                <LinkFilter
                  prop="role"
                  label="Filter by role:"
                  options={['inspector', 'licensing']}
                  showAll={{ position: 'after', label: 'All roles' }}
                  formatter={filter => <Snippet>{`filters.role.${filter}`}</Snippet>}
                />
            }
          </div>
      }

      <Datatable formatters={formatters} />
    </Fragment>
  );
}
