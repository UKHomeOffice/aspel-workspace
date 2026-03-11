import React from 'react';
import { FormLayout, Header, Snippet } from '@ukhomeoffice/asl-components';
import CourseSummary from '../components/course-summary';
import { useSelector } from 'react-redux';

export default function RescheduleCoursePage() {
  const trainingCourseId = useSelector((state) => state.static.trainingCourseId);

  return <>
    <FormLayout cancelLink='categoryE.course.read' trainingCourseId={trainingCourseId}>
      <Header
        title={<Snippet>pageTitle</Snippet>}
        subtitle={<Snippet>pageSubtitle</Snippet>}
      />
      <CourseSummary />
    </FormLayout>
  </>;
}
