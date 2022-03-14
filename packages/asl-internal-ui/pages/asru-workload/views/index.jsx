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

function ActionedBetween() {
  const { progress, start, end } = useSelector(state => state.static.query);
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
        <input type="hidden" name="progress" value={progress} />
        <button type="submit" className="govuk-button"><Snippet>buttons.submit</Snippet></button>
      </p>
    </form>
  );
}

export default function AsruProfilesList() {
  const { progress, start, end } = useSelector(state => state.static.query);
  const filters = useSelector(state => state.datatable.filters);
  const withAsru = get(filters, 'active.withAsru', []).includes('yes');
  const tabs = ['open', 'returned', 'closed'];

  return (
    <Fragment>
      <Header
        title={<Snippet>page.title</Snippet>}
        subtitle={<Snippet>page.subtitle</Snippet>}
      />

      <p><Snippet>page.description</Snippet></p>

      <Tabs active={tabs.indexOf(progress)}>
        {
          tabs.map(tab => <Link page="asruWorkload" key={tab} query={{progress: tab, start, end}} label={<Snippet>{`tabs.${tab}`}</Snippet>} />)
        }
      </Tabs>

      { progress === 'returned' && <ActionedBetween /> }
      { progress === 'closed' && <ActionedBetween /> }

      <div className="task-filters">
        {
          progress === 'open' &&
          <LinkFilter
            prop="withAsru"
            label="Filter by status:"
            options={['yes', 'no']}
            showAll={{ position: 'after', label: 'All tasks' }}
            formatter={filter => <Snippet>{`filters.withAsru.${filter}`}</Snippet>}
          />
        }

        {
          (withAsru || progress === 'closed') &&
            <LinkFilter
              prop="role"
              label="Filter by role:"
              options={['inspector', 'licensing']}
              showAll={{ position: 'after', label: 'All roles' }}
              formatter={filter => <Snippet>{`filters.role.${filter}.${progress}`}</Snippet>}
            />
        }
      </div>

      <Datatable formatters={formatters} />
    </Fragment>
  );
}
