import React, { Fragment } from 'react';
import { Snippet, Link } from '@asl/components';

function EnforcementSubjectHeader({ subject, idx }) {
  const establishment = subject.establishment;
  const profile = subject.profile;
  const pil = profile.pil;
  const projects = profile.projects;

  return (
    <div className="enforcement-subject-header">
      <h3><Snippet idx={idx + 1}>subjects.repeaterHeading</Snippet></h3>
      <dl className="inline wide">
        <dt><Snippet>establishment.label</Snippet></dt>
        <dd>{establishment.name}</dd>
        <dt><Snippet>profile.label</Snippet></dt>
        <dd>{ profile && `${profile.firstName} ${profile.lastName}` }</dd>
        {
          profile.roles.length > 0 &&
            <Fragment>
              <dt><Snippet>roles.label</Snippet></dt>
              <dd>
                <ul>
                  { profile.roles.map(role => <li key={role.id}>{role.type}</li>) }
                </ul>
              </dd>
            </Fragment>
        }
        {
          (pil || projects.length > 0) &&
            <Fragment>
              <dt><Snippet>licences.label</Snippet></dt>
              <dd>
                <ul>
                  { pil &&
                    <li>
                      <Link page="pil.read" establishmentId={pil.establishmentId} profileId={pil.profileId} label={`PIL: ${profile.pilLicenceNumber}`} />
                    </li>
                  }
                  {
                    projects.map(project => (
                      <li key={project.id}>
                        <Link page="project.read" establishmentId={project.establishmentId} projectId={project.id} label={`PPL: ${project.licenceNumber}`} />
                      </li>
                    ))
                  }
                </ul>
              </dd>
            </Fragment>
        }
      </dl>
    </div>
  );
}

export default EnforcementSubjectHeader;
