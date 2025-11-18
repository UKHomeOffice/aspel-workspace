import React from 'react';
import { Header, Snippet } from '@ukhomeoffice/asl-components';
import CourseSummary from '../components/course-summary';
import CourseActionLinks from '../components/course-action-links';
import { CourseParticipants } from '../components/course-participants';
import FlashBanner from '@ukhomeoffice/asl-components/src/flash-banner';

export default function CoursePage() {

  return <>
    <Header
      title={<Snippet>pageTitle</Snippet>}
      subtitle={<Snippet>pageSubtitle</Snippet>}
    />
    <FlashBanner />
    <CourseSummary />
    <CourseActionLinks />
    <CourseParticipants />
  </>;
}
