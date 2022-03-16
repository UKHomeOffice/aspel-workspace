import React, { Fragment } from 'react';
import { Snippet, Link } from '@asl/components';
import EnforcementSubjectHeader from './enforcement-subject-header';
import EnforcementBanner from '../../../components/enforcement-banner';

function EnforcementSubjectRead({ enforcementCase, subject, idx }) {
  const status = subject.flags[0].status; // all flags have same status
  const profileFlag = subject.flags.find(flag => flag.modelType === 'profile');
  const pilFlag = subject.flags.find(flag => flag.modelType === 'pil');
  const projectFlags = subject.flags.filter(flag => flag.modelType === 'project');

  return (
    <div className="enforcement-subject">
      <EnforcementSubjectHeader subject={subject} idx={idx} />

      <div className="enforcement-flags">
        <h3><Snippet>flag.heading</Snippet></h3>

        <p><strong><Snippet>flag.status</Snippet></strong></p>
        <EnforcementBanner enforcementCase={enforcementCase} status={status} />

        <p><strong><Snippet>flag.appliedTo.heading</Snippet></strong></p>
        <ul>
          {
            profileFlag &&
              <li key={profileFlag.id}>
                <Fragment>
                  <Link page="profile.read" establishmentId={profileFlag.establishmentId} profileId={profileFlag.profile.id} label={<Snippet profile={profileFlag.profile}>flag.appliedTo.profile.link</Snippet>} />
                  <Snippet>flag.appliedTo.profile.summary</Snippet>
                </Fragment>
              </li>
          }
          {
            pilFlag &&
              <li key={pilFlag.id}>
                <Fragment>
                  <Link page="pil.read" establishmentId={pilFlag.pil.establishmentId} profileId={pilFlag.profile.id} label={<Snippet profile={pilFlag.profile}>flag.appliedTo.pil.link</Snippet>} />
                  <Snippet>flag.appliedTo.pil.summary</Snippet>
                </Fragment>
              </li>
          }
          {
            projectFlags.map(flag => (
              <li key={flag.id}>
                <Link page="project.read" establishmentId={flag.establishmentId} projectId={flag.modelId} label={<Snippet profile={flag.profile} project={flag.project}>flag.appliedTo.project.link</Snippet>} />
                <Snippet>flag.appliedTo.project.summary</Snippet>
              </li>
            ))
          }
        </ul>

        <button className="govuk-button button-secondary"><Snippet>action.editFlag</Snippet></button>
      </div>

    </div>
  );
}

export default EnforcementSubjectRead;
