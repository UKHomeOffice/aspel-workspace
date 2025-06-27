import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Snippet, Link } from '@ukhomeoffice/asl-components';
import { Button } from '@ukhomeoffice/react-components';
import { format, getYear, isBefore, isAfter, endOfDay, addDays, subMilliseconds } from 'date-fns';
import { dateFormat } from '../../../../../constants';
import { formatDate } from '../../../../../lib/utils';
import partition from 'lodash/partition';
import pick from 'lodash/pick';
import Subsection from '../components/subsection';

function getDeadline(ropYear, project) {
  const endOfJan = endOfDay(new Date(`${ropYear + 1}-01-31`));

  function getRefDate(date) {
    return subMilliseconds(addDays(new Date(date), 29), 1);
  }

  switch (project.status) {
    case 'active':
      return isBefore(getRefDate(project.expiryDate), endOfJan)
        ? getRefDate(project.expiryDate)
        : endOfJan;
    case 'expired':
      return getRefDate(project.expiryDate);
    case 'revoked':
      return getRefDate(project.revocationDate);
    default:
      return endOfJan;
  }
}

export function Rop({ rop, project, active, url }) {
  const endOfYear = new Date(`${rop.year}-12-31`);
  const projEnd = project.revocationDate || project.expiryDate;
  const expiresMidYear = isBefore(projEnd, endOfYear);
  const endDate = format(expiresMidYear ? projEnd : endOfYear, dateFormat.long);
  const ropsDeadline = getDeadline(rop.year, project);

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
    );
  } else {
    cta = (
      <form method="POST" action={`${url}/rops`}>
        <input type="hidden" name="year" value={rop.year} />
        <Button className="button-secondary">
          <Snippet year={rop.year}>rops.start</Snippet>
        </Button>
      </form>
    );
  }

  const snippetKey = rop.status === 'submitted' ? 'rops.submitted' : 'rops.incomplete';

  const content = (
    <Fragment>
      <h3>Return of procedures for {rop.year}</h3>
      <Snippet
        isPtag={false}
        submitted={formatDate(rop.submittedDate, dateFormat.long)}
        endDate={endDate}
        year={rop.year}
        deadline={formatDate(ropsDeadline, dateFormat.long)}
      >
        {snippetKey}
      </Snippet>
    </Fragment>
  );

  return (
    <Fragment>
      {active && content}
      {cta}
    </Fragment>
  );
}

export function Rops({ project = {}, ropsYears = [], url, today = new Date() }) {
  const thisYear = today.getFullYear();
  const projectGrantedYear = project.issueDate && getYear(project.issueDate);
  const projectEndDate = project.revocationDate || project.expiryDate;

  function isActiveInYear(year) {
    return !projectGrantedYear || projectGrantedYear <= year;
  }

  function hasEndedBefore(year) {
    const startOfFeb = subMilliseconds(new Date(`${year}-02-01`), 1);
    return (projectEndDate && isAfter(today, projectEndDate)) || isAfter(today, startOfFeb);
  }

  const relevantYears = ropsYears.filter(year => isActiveInYear(year) && hasEndedBefore(year));

  const activeYears = relevantYears.filter(year =>
    year >= thisYear || (year === thisYear - 1 && today.getMonth() < 6)
  );

  const rops = [...project.rops]; // clone for mutation safety

  relevantYears.forEach(year => {
    if (!rops.find(r => r.year === year)) {
      rops.unshift({ year });
    }
  });

  const requiredRops = rops.filter(rop =>
    !projectEndDate || isAfter(new Date(projectEndDate), new Date(`${rop.year}-01-01`))
  );

  if (!requiredRops.length) {
    return (
      <p>
        <strong>
          <Snippet>rops.not-due</Snippet>
        </strong>
      </p>
    );
  }

  const [activeRops, previousRops] = partition(requiredRops, rop =>
    activeYears.includes(rop.year) || rop.status !== 'submitted'
  );

  return (
    <Subsection title={<Snippet>rops.title</Snippet>}>
      <br />
      {activeRops.map((rop, index) => (
        <Rop key={index} project={project} rop={rop} active={true} url={url} />
      ))}

      {!!previousRops.length && (
        <Fragment>
          <h3>
            <Snippet>rops.previous</Snippet>
          </h3>
          {previousRops.map((rop, index) => (
            <Rop key={index} project={project} rop={rop} url={url} />
          ))}
        </Fragment>
      )}
    </Subsection>
  );
}

export default function RopsSection() {
  const canAccessRops = useSelector(state => state.static.canAccessRops);
  if (!canAccessRops) {
    return null;
  }

  const props = pick(useSelector(state => state.static), 'project', 'ropsYears', 'url');
  return <Rops {...props} />;
}
