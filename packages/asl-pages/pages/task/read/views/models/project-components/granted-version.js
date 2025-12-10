import React from 'react';
import { StickyNavAnchor, Snippet, Link } from '@ukhomeoffice/asl-components';

const GrantedVersion = ({ project, establishment }) => (
  <StickyNavAnchor id="granted" key="granted">
    <h2><Snippet>sticky-nav.granted</Snippet></h2>
    <p><Snippet>versions.granted.info</Snippet></p>
    <p className="gutter">
      <Link
        page="projectVersion"
        className="govuk-button button-secondary"
        versionId={project.granted.id}
        establishmentId={establishment.id}
        projectId={project.id}
        label={<Snippet>versions.granted.label</Snippet>}
      />
    </p>
  </StickyNavAnchor>
);

export default GrantedVersion;
