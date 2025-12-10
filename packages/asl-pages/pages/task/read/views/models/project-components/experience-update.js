import React from 'react';
import { StickyNavAnchor, Snippet } from '@ukhomeoffice/asl-components';
import { StaticRouter } from 'react-router';
import { ReviewFields } from '@asl/projects/client/components/review-fields';

const ExperienceUpdate = ({
  version,
  task,
  project,
  experience
}) => (
  <StickyNavAnchor id="experience" key="experience">
    <h2><Snippet>sticky-nav.experience</Snippet></h2>
    <StaticRouter>
      <ReviewFields
        fields={experience(version, project.schemaVersion).fields}
        values={task.data.data}
        project={version.data}
        readonly={true}
        noComments
        altLabels
      />
    </StaticRouter>
  </StickyNavAnchor>
);

export default ExperienceUpdate;
