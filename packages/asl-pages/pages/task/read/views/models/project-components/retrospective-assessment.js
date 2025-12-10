import React from 'react';
import { StickyNavAnchor, Snippet, Link, Utils } from '@ukhomeoffice/asl-components';

const RetrospectiveAssessment = ({ project, ra, isAsru, dateFormat }) => (
  <StickyNavAnchor id="ra" key="ra">
    <h2><Snippet>sticky-nav.ra</Snippet></h2>
    {isAsru
      ? <p><Snippet>ra.content</Snippet></p>
      : <p><Snippet date={Utils.formatDate(project.raDate, dateFormat.long)}>ra.due</Snippet></p>
    }
    <Link
      page="retrospectiveAssessment.update"
      className="govuk-button button-secondary gutter"
      label={<Snippet>ra.view</Snippet>}
      raId={ra.id}
      establishmentId={project.establishmentId}
      projectId={project.id}
    />
  </StickyNavAnchor>
);

export default RetrospectiveAssessment;
