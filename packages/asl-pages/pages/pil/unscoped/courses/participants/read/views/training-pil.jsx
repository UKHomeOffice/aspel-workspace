import React from 'react';
import pick from 'lodash/pick';
import schema from '../../../schema';
import trainingPilSchema from '../../schema';
import { ModelSummary, Inset } from '@asl/components';
import formatters from '../../../formatters';

export default function TrainingPil({ className, trainingPil }) {
  const fields = [
    'species',
    (trainingPil.issueDate ? 'issueDate' : 'startDate'),
    ...[trainingPil.status && trainingPil.status !== 'inactive' ? 'expiryDate' : []],
    'establishment',
    'projectTitle',
    'projectId'
  ];
  return (
    <Inset className={className}>
      <ModelSummary
        model={{ ...trainingPil.trainingCourse, ...pick(trainingPil, 'expiryDate', 'issueDate') }}
        schema={pick({ ...schema, ...trainingPilSchema }, fields)}
        formatters={formatters}
        inline={false}
      />
    </Inset>
  );
}
