import React from 'react';
import { formatCoursePurpose, formatSpeciesAsList } from '../../../formatters';
import { ModelSummary } from '@ukhomeoffice/asl-components';

const schema = {
  title: {},
  coursePurpose: {},
  species: {}
};

const formatters = {
  coursePurpose: { format: formatCoursePurpose },
  species: { format: formatSpeciesAsList }
};

export default function CourseSummary() {
  return <>
    <ModelSummary schema={schema} formatters={formatters} />
  </>;
}
