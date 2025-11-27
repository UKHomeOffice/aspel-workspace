import React from 'react';
import { useSelector } from 'react-redux';
import { Header, Snippet, FormLayout } from '@ukhomeoffice/asl-components';

export default function Page() {
  const course = useSelector(state => state.static.course);
  return (
    <FormLayout cancelLink="categoryE.course.read">
      <Header
        title={<Snippet>title</Snippet>}
        subtitle={course.title}
      />

      <p className="govuk-body"><Snippet>description</Snippet></p>
    </FormLayout>
  );
}
