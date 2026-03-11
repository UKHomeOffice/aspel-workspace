import React from 'react';
import { FormLayout, Header, Link, Snippet } from '@ukhomeoffice/asl-components';
import { useSelector } from 'react-redux';
import DurationSummary from '../components/duration-summary';

export default function CourseDetailsPage() {
  const trainingCourseId = useSelector((state) => state.static.trainingCourseId);
  const previous = useSelector((state) => state.static.trainingCourse);
  const updated = useSelector((state) => state.model);
  return <>
    <FormLayout cancelLink='categoryE.course.read' trainingCourseId={trainingCourseId}>
      <Header
        title={<Snippet>pageTitle</Snippet>}
        subtitle={<Snippet>pageSubtitle</Snippet>}
      />
      <DurationSummary prefix={'previous'} model={previous} />
      <hr />
      <DurationSummary prefix={'new'} model={updated} comparison={previous}/>
      <hr />
      <p>
        <Link
          page='categoryE.course.reschedule'
          suffix='/change-dates'
          trainingCourseId={trainingCourseId}
        >
          <Snippet>buttons.change</Snippet>
        </Link>
      </p>

    </FormLayout>
  </>;
}
