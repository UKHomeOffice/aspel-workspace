import React, { Fragment } from 'react';
import { Link } from '@ukhomeoffice/asl-components';

export default function ProjectTitle({ project, establishment }) {
  return (
    <Fragment>
      <dt>Project title</dt>
      <dd>
        <Link
          page="project.read"
          establishmentId={establishment.id}
          projectId={project.id}
          label={project.title || 'Untitled project'}
        />
      </dd>
    </Fragment>
  );
}
