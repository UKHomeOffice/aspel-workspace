import React from 'react';
import { useSelector } from 'react-redux';
import { Datatable, Link, Snippet } from '@ukhomeoffice/asl-components';
import {
  formatProfile,
  formatTaskActions,
  formatTaskDetails,
  formatTaskStatus
} from '../../../formatters';

const formatters = {
  profile: {
    format: (subject) => formatProfile(null, subject?.firstName, subject?.lastName)
  },
  licenceDetails: {
    format: (_, task) => formatTaskDetails(task)
  },
  status: {
    format: (status, task) => formatTaskStatus(status, task)
  },
  action: {
    format: (_, task) => formatTaskActions(task)
  }
};

export function CourseParticipants() {
  const { establishmentId, trainingCourseId } = useSelector(state => state.static);
  const hasParticipants = useSelector(state => state.datatable.data.rows.length) > 0;

  const applyButton = <Link
    className="govuk-button"
    page="categoryE.course.addParticipant"
    establishmentId={establishmentId}
    trainingCourseId={trainingCourseId}
  >
    <Snippet>actions.addParticipant</Snippet>
  </Link>;

  if (!hasParticipants) {
    return <>
      <h2><Snippet>participantsHeader</Snippet></h2>
      <p><Snippet>noParticipantsMessage</Snippet></p>
      {applyButton}
    </>;
  }

  return <>
    <h2 id='course-participants-header'><Snippet>participantsHeader</Snippet></h2>
    {applyButton}
    <Datatable
      formatters={formatters}
      pagination={{autoUI: true}}
      tableProps={{'aria-labelledby': 'course-participants-header'}}
    />
  </>;
}
