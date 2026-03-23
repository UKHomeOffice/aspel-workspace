import React from 'react';
import { FormLayout, Header, Snippet } from '@ukhomeoffice/asl-components';
import ProjectSummary from '../components/project-summary';
import CourseSummary from '../components/course-summary';
import { useSelector } from 'react-redux';

export default function CourseDetailsPage() {
  const trainingCourseId = useSelector((state) => state.static.trainingCourseId);
  const cancelLink = `categoryE.course.${trainingCourseId ? 'read' : 'list'}`;

  return <>
    <FormLayout cancelLink={cancelLink} trainingCourseId={trainingCourseId}>
      <Header title={<Snippet>pageTitle</Snippet>} />
      <ProjectSummary />
      <CourseSummary />
    </FormLayout>
  </>;
}
