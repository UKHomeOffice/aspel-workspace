import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import { Datatable, Snippet, Header, Link, LinkFilter, Tabs } from '@asl/components';
import DatePicker from '../../reporting/views/components/date-picker';

const formatters = {
  assignedTo: {
    format: assignedTo => {
      return (assignedTo.id === 'unassigned')
        ? <span>Unassigned tasks</span>
        : <Link page="globalProfile" profileId={assignedTo.id} label={`${assignedTo.firstName} ${assignedTo.lastName}`} />;
    }
  }
};

function CompletedBetween() {
  const { start, end } = useSelector(state => state.static.query);
  return (
    <form method="GET" className="metrics-filters">
      <p>
        Showing tasks completed from <label htmlFor="start">from</label>:
        <DatePicker
          name="start"
          title="Start date"
          maxDate={new Date()}
          minDate={new Date(2019, 6, 31)}
          date={start}
        />
        <label htmlFor="end">to</label>
        <DatePicker
          name="end"
          title="End date"
          maxDate={new Date()}
          minDate={new Date(2019, 6, 31)}
          date={end}
        />
        <input type="hidden" name="progress" value="closed" />
        <button type="submit" className="govuk-button"><Snippet>buttons.submit</Snippet></button>
      </p>
    </form>
  );
}

export default function AsruProfilesList() {
  const { progress } = useSelector(state => state.static.query);
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

      { progress === 'closed' && <CompletedBetween /> }

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
