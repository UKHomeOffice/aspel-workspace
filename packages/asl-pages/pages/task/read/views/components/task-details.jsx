import React from 'react';
import get from 'lodash/get';
import { Snippet } from '@ukhomeoffice/asl-components';
import { ProjectDetails } from './task-detail/project-details';
import { PilDetails } from './task-detail/pil-details';
import { ProfileDetails } from './task-detail/profile-details';
import { EstablishmentDetails } from './task-detail/establishment-details';

export default function TaskDetails({ task }) {
  const model = get(task, 'data.model');

  return (
    <div className="task-details">
      <h2><Snippet>sticky-nav.details</Snippet></h2>
      {
        model === 'profile' && <ProfileDetails task={task} />
      }

      {
        ['project', 'retrospective-assessment', 'rop'].includes(model) &&
          <ProjectDetails task={task} />
      }

      {
        ['pil', 'trainingPil'].includes(model) &&
          <PilDetails task={task} />
      }

      {
        ['establishment', 'place', 'role'].includes(model) &&
          <EstablishmentDetails task={task} />
      }
    </div>
  );
}
