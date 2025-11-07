import React from 'react';
import { useSelector } from 'react-redux';
import { formatCourseDateRange, formatCoursePurpose, formatProjectLicenceNumber, ucFirst } from '../../../formatters';
import { ModelSummary } from '@ukhomeoffice/asl-components';

const schema = {
  coursePurpose: {},
  startDate: {},
  species: {},
  projectTitle: {
    accessor: 'project.title'
  },
  projectLicenceNumber: {
    accessor: 'project.licenceNumber'
  }
};

const formatters = {
  coursePurpose: { format: formatCoursePurpose },
  startDate: {
    format: (startDate, course) => {
      return formatCourseDateRange(startDate, course.endDate);
    }
  },
  species: {
    format: (species) =>
      <ul className='govuk-list govuk-list--bullet'>
        {(species ?? []).map(species => <li key={species}>{ucFirst(species)}</li>)}
      </ul>
  },
  projectLicenceNumber: {
    format: (licenceNumber, model) =>
      formatProjectLicenceNumber(
        licenceNumber,
        model.project.establishmentId,
        model.projectId
      )
  }
};

export default function CourseSummary() {
  const trainingCourse = useSelector(state => state.static.trainingCourse);

  return <ModelSummary schema={schema} formatters={formatters} model={trainingCourse} />;
}
