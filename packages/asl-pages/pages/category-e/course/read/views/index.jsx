import React from 'react';
import { Header, Snippet } from '@ukhomeoffice/asl-components';

export default function CoursePage() {
  return <>
    <Header
      title={<Snippet>pageTitle</Snippet>}
      subtitle={<Snippet>pageSubtitle</Snippet>}
    />
  </>;
}
