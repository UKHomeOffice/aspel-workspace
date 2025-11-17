import { Link, Snippet } from '@ukhomeoffice/asl-components';
import React from 'react';
import { useSelector } from 'react-redux';
import { endOfDay, isAfter } from 'date-fns';

export default function CourseActionLinks() {
  const { establishmentId, trainingCourseId } = useSelector(state => state.static);
  const hasParticipants = useSelector(state => state.datatable.data.rows.length) > 0;
  const courseStarted = useSelector(state => isAfter(state.static.trainingCourse.startDate, endOfDay(new Date())));

  if (!hasParticipants) {
    return <p>
      <Link page={'categoryE.course.update'}
        establishmentId={establishmentId}
        trainingCourseId={trainingCourseId}
      >
        <Snippet>actions.updateCourse</Snippet>
      </Link>
      {' | '}
      <Link page={'categoryE.course.remove'}
        establishmentId={establishmentId}
        trainingCourseId={trainingCourseId}
      >
        <Snippet>actions.deleteCourse</Snippet>
      </Link>
    </p>;
  }

  if (!courseStarted) {
    return <p>
      <Link page={'categoryE.course.reschedule'}
        establishmentId={establishmentId}
        trainingCourseId={trainingCourseId}
      >
        <Snippet>actions.updateCourseDates</Snippet>
      </Link>
    </p>;
  }

  return null;
}
