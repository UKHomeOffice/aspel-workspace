import React from 'react';
import { useSelector } from 'react-redux';
import {
  formatCourseDuration,
  formatCoursePurpose,
  formatSpeciesAsList
} from '../../../formatters';
import { Link, ModelSummary, Snippet } from '@ukhomeoffice/asl-components';

const schema = {
  title: {},
  coursePurpose: {},
  courseDuration: {},
  species: {}
};

const formatters = {
  coursePurpose: { format: formatCoursePurpose },
  courseDuration: { format: formatCourseDuration },
  species: { format: formatSpeciesAsList }
};

export default function CourseSummary() {
  const establishmentId = useSelector(state => state.static.establishmentId);

  return <>
    <ModelSummary schema={schema} formatters={formatters} />
    <p>
      <Link
        page="categoryE.course.add"
        suffix="/course-details"
        establishmentId={establishmentId}
      >
        <Snippet>actions.changeCourseDetails</Snippet>
      </Link>
    </p>
  </>;
}
