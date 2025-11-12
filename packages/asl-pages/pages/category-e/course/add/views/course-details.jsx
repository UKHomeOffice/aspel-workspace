import React from 'react';
import { FormLayout, Header, Snippet } from '@ukhomeoffice/asl-components';
import ProjectSummary from '../components/project-summary';

export default function CourseDetailsPage() {
  return <>
    <FormLayout cancelLink={'categoryE.course.list'}>
      <Header title={<Snippet>pageTitle</Snippet>} />
      <ProjectSummary />
    </FormLayout>
  </>;
}
