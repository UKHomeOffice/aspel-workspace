import React from 'react';
import { useSelector } from 'react-redux';
import { formatCourseDateRange, formatCoursePurpose, ucFirst } from '../../../formatters';
import { Link, ModelSummary, Snippet } from '@ukhomeoffice/asl-components';

const schema = {
  title: {},
  coursePurpose: {},
  courseDuration: {},
  species: {}
};

const formatters = {
  coursePurpose: { format: formatCoursePurpose },
  courseDuration: {
    format: (duration, course) => {
      switch (duration) {
        case 'one-day':
          return formatCourseDateRange(course.courseDate);
        case 'multi-day':
          return formatCourseDateRange(course.startDate, course.endDate);
      }
    }
  },
  species: {
    format: (species) =>
      <ul className='govuk-list govuk-list--bullet'>
        {(species ?? []).map(species => <li key={species}>{ucFirst(species)}</li>)}
      </ul>
  }
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
