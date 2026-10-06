import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { FormLayout, Header, Snippet } from '@ukhomeoffice/asl-components';

export default function Confirm() {
  const { firstName, lastName } = useSelector(state => state.model);

  const declaration = (
    <Fragment>
      <h2><Snippet>declaration.title</Snippet></h2>
      <Snippet>declaration.content</Snippet>
    </Fragment>
  );

  return (
    <FormLayout
      declaration={declaration}
      cancelLink="categoryE.course.read"
    >
      <Header
        title={<Snippet>title</Snippet>}
        subtitle={`${firstName} ${lastName}`}
      />
    </FormLayout>
  );
}
