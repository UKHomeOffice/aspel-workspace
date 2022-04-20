import React, { Fragment } from 'react';
import { Snippet, Link } from '@asl/components';

function EnforcementSubjectHeader({ subject }) {
  const establishment = subject && subject.establishment;
  const profile = subject && subject.profile;
  const pil = profile && profile.pil;
  const projects = (profile && profile.projects.filter(p => p.status === 'active')) || [];

  return (
    <div className="enforcement-subject-header">
      {
        subject &&
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
                      { profile.roles.map(role =>
                        <li key={role.id}>{`${role.type.toUpperCase()} (${role.establishment.name})`}</li>
                      ) }
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
      }
    </div>
  );
}

export default EnforcementSubjectHeader;
