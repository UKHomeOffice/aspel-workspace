import React from 'react';
import { useSelector } from 'react-redux';
import {
  formatProjectLicenceNumber,
  formatDate,
  formatCourseDuration,
  formatSpecies,
  formatCoursePurpose
} from '../../../formatters';
import { ModelSummary } from '@ukhomeoffice/asl-components';

const schema = {
  projectTitle: { accessor: 'project.title' },
  projectId: { accessor: 'project.licenceNumber' },
  expiryDate: { accessor: 'project.expiryDate' },
  title: {},
  coursePurpose: {},
  courseDuration: {},
  species: {}
};

const formatters = {
  licenceNumber: {
    format: (licenceNumber, project) => formatProjectLicenceNumber(licenceNumber, project.establishmentId, project.id)
  },
  expiryDate: { format: (expiry) => formatDate(expiry) },
  coursePurpose: { format: formatCoursePurpose },
  courseDuration: { format: formatCourseDuration },
  species: { format: formatSpecies }
};

export default function CourseSummary() {
  const trainingCourse = useSelector(state => state.static.trainingCourse);

  return trainingCourse
    ? <ModelSummary schema={schema} formatters={formatters} model={trainingCourse} />
    : null;
}
