import React from 'react';
import { useSelector } from 'react-redux';
import { formatProjectLicenceNumber, formatDate } from '../formatters';
import { Link, ModelSummary, Snippet } from '@ukhomeoffice/asl-components';

const schema = {
  projectTitle: {accessor: 'title'},
  licenceNumber: {},
  expiryDate: {}
};

const formatters = {
  licenceNumber: {
    format: (licenceNumber, project) => formatProjectLicenceNumber(licenceNumber, project.establishmentId, project.id)
  },
  expiryDate: {
    format: (expiryDate) => formatDate(expiryDate)
  }
};

export default function ProjectSummary() {
  const project = useSelector(state => state.static.project);

  return project
    ? <>
      <ModelSummary schema={schema} formatters={formatters} model={project} />
      <p>
        <Link
          page="categoryE.course.add"
          suffix="/select-licence"
          establishmentId={project.establishmentId}
        >
          <Snippet>actions.changeProjectLicence</Snippet>
        </Link>
      </p>
    </>
    : null;
}
