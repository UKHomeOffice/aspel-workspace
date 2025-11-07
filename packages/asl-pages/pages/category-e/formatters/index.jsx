import React from 'react';
import { format, getMonth, getYear } from 'date-fns';
import { Link, Snippet } from '@ukhomeoffice/asl-components';
import { dateFormat } from '../../../constants';
import taskFormatters from '../../task/list/formatters';
import classnames from 'classnames';
import { trainingCoursePurpose } from '@ukhomeoffice/asl-constants';

export const formatDate = (date, formatSpec = dateFormat.medium) =>
  // \u00A0 is non-breaking space to prevent tables flowing the dates onto multiple lines
  date
    ? format(date, formatSpec).replace(/ /g, '\u00A0')
    : '-';

export const formatCourseTitle = (title, trainingCourseId) =>
  trainingCourseId
    ? <Link
      page="categoryE.course.read"
      trainingCourseId={trainingCourseId}
      label={title}
    />
    : (title ?? '-');

export const formatProjectLicenceNumber = (licenceNumber, establishmentId, projectId) =>
  projectId && establishmentId
    ? <Link
      page="project.read"
      establishmentId={establishmentId}
      projectId={projectId}
      label={licenceNumber}
    />
    : (licenceNumber ?? '-');

export const ucFirst = (str) => str.charAt(0).toLocaleUpperCase() + str.slice(1);
export const formatSpecies = species =>
  !species || species.length === 0
    ? '-'
    : species.map(ucFirst).sort().join(', ');

export const formatCourseDateRange = (startDate, endDate) => {
  if (!startDate) {
    return '-';
  } else if (!endDate) {
    return formatDate(startDate, dateFormat.medium);
  } else if (getYear(startDate) !== getYear(endDate)) {
    return `${formatDate(startDate, dateFormat.medium)} to ${formatDate(endDate, dateFormat.medium)}`;
  } else if (getMonth(startDate) !== getMonth(endDate)) {
    return `${formatDate(startDate, 'd MMM')} to ${formatDate(endDate, dateFormat.medium)}`;
  } else {
    // in the case of 2 dates in one month, e.g. 1 to 2 Feb 2026, keep the whole range on a single line with nbsp.
    return `${formatDate(startDate, 'd')}\u00A0to\u00A0${formatDate(endDate, dateFormat.medium)}`;
  }
};

export const formatProfile = (profileId, firstName, lastName, establishmentId) =>
  profileId && establishmentId
    ? <Link
      page='profile.read'
      profileId={profileId}
      establishmentId={establishmentId}
      label={`${firstName} ${lastName}`}
    />
    : ([firstName, lastName].join(' ') || '-');

export const formatTaskDetails = task => {
  if (task?.status !== 'resolved') {
    return <Link page="task.read" taskId={task.id} label="View task" />;
  }
  if (task?.modelStatus === 'active') {
    return <Link
      page="categoryE.licence.read"
      trainingPilId={task.data.id}
      establishemntId={task.data.establishmentId}
      label={task.data.subject.pilLicenceNumber}
    />;
  }
  return '-';
};

export const formatTaskStatus = (status, task) => {
  const visibleTaskStatuses = [
    'discarded-by-applicant',
    'rejected'
  ];
  if (task.modelStatus === 'inactive' || visibleTaskStatuses.includes(status)) {
    return taskFormatters.status.format(status, task);
  }
  const bad = ['expired', 'transferred', 'revoked'];
  const good = ['active'];
  const className = classnames({ badge: true, complete: good.includes(task.modelStatus), rejected: bad.includes(task.modelStatus) });
  return <span className={ className }>{task.modelStatus?.toUpperCase() ?? '-'}</span>;
};

export const formatTaskActions = task => {
  if (task.modelStatus === 'active') {
    return <Link
      page="categoryE.licence.read"
      suffix="/revoke"
      trainingPilId={task.data.id}
      establishemntId={task.data.establishmentId}
      label={<Snippet>actions.revoke</Snippet>}
    />;
  }
};

export const formatCoursePurpose = purpose => trainingCoursePurpose[purpose] ?? purpose;
