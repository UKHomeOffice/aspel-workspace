import React from 'react';
import { useSelector } from 'react-redux';
import {
  Header,
  Snippet,
  FormLayout
} from '@asl/components';

export default function ProjectLandingPage() {
  const model = useSelector(state => state.model);

  return (
    <FormLayout>
      <Header
        subtitle={model.title}
        title={<Snippet>title</Snippet>}
      />
    </FormLayout>
  );
}
