import React from 'react';
import { FormLayout, Header, Snippet } from '@ukhomeoffice/asl-components';
import ProjectSummary from '../components/project-summary';
import { useSelector } from 'react-redux';

export default function CourseDetailsPage() {
  const trainingCourseId = useSelector((state) => state.static.trainingCourseId);
  const mode = trainingCourseId ? 'update' : 'add';
  const cancelLink = `categoryE.course.${trainingCourseId ? 'read' : 'list'}`;

  return <>
    <FormLayout
      cancelLink={cancelLink}
      trainingCourseId={trainingCourseId}
    >
      <Header title={<Snippet>pageTitle.{mode}</Snippet>} />
      <ProjectSummary />
    </FormLayout>
  </>;
}
