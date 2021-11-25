import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Snippet, Link } from '@asl/components';
import { Button } from '@ukhomeoffice/react-components';
import format from 'date-fns/format';
import { dateFormat } from '../../../../../constants';
import isBefore from 'date-fns/is_before';
import isAfter from 'date-fns/is_after';
import endOfDay from 'date-fns/end_of_day';
import addDays from 'date-fns/add_days';
import subMilliseconds from 'date-fns/sub_milliseconds';
import partition from 'lodash/partition';
import Subsection from '../components/subsection';

function Rop({ rop, project, active, ropNotRequired }) {
  const { url } = useSelector(state => state.static);
  const endOfYear = new Date(`${rop.year}-12-31`);
  const projEnd = project.revocationDate || project.expiryDate;
  const expiresMidYear = isBefore(projEnd, endOfYear);
  const endDate = format(expiresMidYear ? projEnd : endOfYear, dateFormat.long);

  let cta;

  if (rop.status === 'submitted') {
    cta = (
      <p>
        <Link
          page="rops.procedures"
          ropId={rop.id}
          label={<Snippet year={rop.year}>rops.read</Snippet>}
        />
      </p>
    );
  } else if (rop.status === 'draft') {
    cta = (
      <p>
        <Link
          page="rops.update"
          step="confirm"
          ropId={rop.id}
          label={<Snippet year={rop.year}>rops.continue</Snippet>}
        />
      </p>
    )
  } else {
    cta = (
      <form method="POST" action={`${url}/rops`}>
        <input type="hidden" name="year" value={rop.year} />
        <Button className="button-secondary">
          <Snippet year={rop.year}>rops.start</Snippet>
        </Button>
      </form>
    )
  }

  if (ropNotRequired) {
    return <p><strong><Snippet>rops.not-due</Snippet></strong></p>
  }

  function getDeadline() {
    const endOfJan = endOfDay(new Date(`${rop.year + 1}-01-31`));

    function getRefDate(date) {
      return subMilliseconds(addDays(new Date(date), 29), 1);
    }

    switch (project.status) {
      case 'active':
        const refDate = getRefDate(project.expiryDate);
        return isBefore(refDate, endOfJan) ? refDate : endOfJan;
      case 'expired':
        return getRefDate(project.expiryDate);
      case 'revoked':
        return getRefDate(project.revocationDate);
    }
  }

  const ropsDeadline = getDeadline();

  const content = (
    <Fragment>
      <h3>Return of procedures for {rop.year}</h3>
      <p>
        <Snippet
          submittedDate={format(rop.submittedDate, dateFormat.long)}
          endDate={endDate}
          deadline={format(ropsDeadline, dateFormat.long)}
        >{ rop.status === 'submitted' ? 'rops.submitted' : 'rops.incomplete' }</Snippet>
      </p>
    </Fragment>

  );

  return (
    <Fragment>
      { active && content }
      { cta }
    </Fragment>
  );
}

export default function Rops() {
  const { project, ropsYears } = useSelector(state => state.static);

  const thisYear = (new Date()).getFullYear();
  const latestYear = Math.max(...ropsYears);

  const today = new Date();
  const deadline = subMilliseconds(new Date(`${latestYear}-02-01`), 1);

  const showNextYear = isAfter(today, deadline);
  let years = ropsYears;

  if (showNextYear) {
    years = [
      latestYear + 1,
      ...years
    ];
  }

  const activeYears = years.filter(year => year >= thisYear);

  const rops = project.rops;

  const startDate = `${thisYear}-01-01`;
  const endDate = project.revocationDate || project.expiryDate;
  const ropNotRequired = isBefore(new Date(endDate), new Date(startDate));

  if (!ropNotRequired) {
    // add templates for each missing rop
    ropsYears.forEach(year => {
      if (!rops.find(ar => ar.year === year)) {
        rops.unshift({ year });
      }
    })
  }

  const [activeRops, previousRops] = partition(project.rops, rop => {
    return activeYears.includes(rop.year) || rop.status !== 'submitted'
  });

  return (
    <Subsection
      title={<Snippet>rops.title</Snippet>}
    >
    {
      activeRops.map(rop => <Rop project={project} rop={rop} active={true} ropNotRequired={ropNotRequired} />)
    }
    {
      !!previousRops.length && (
        <Fragment>
          <h3><Snippet>rops.previous</Snippet></h3>
          {
            previousRops.map(rop => <Rop project={project} rop={rop} />)
          }
        </Fragment>
      )
    }

    </Subsection>
  );
}
