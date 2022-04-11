import React, { Fragment } from 'react';
import { Snippet, Link } from '@asl/components';
import EnforcementSubjectHeader from './subject-header';
import EnforcementBanner from '../../../components/enforcement-banner';

function EnforcementSubjectRead({ enforcementCase, subject, idx, toggleEdit }) {
  const status = subject.flags[0].status; // all flags have same status
  const profileFlag = subject.flags.find(flag => flag.modelType === 'profile');
  const pilFlag = subject.flags.find(flag => flag.modelType === 'pil');
  const projectFlags = subject.flags.filter(flag => flag.modelType === 'project');

  return (
    <div className="enforcement-subject">
      <h3><Snippet idx={idx + 1}>subjects.repeaterHeading</Snippet></h3>
      <EnforcementSubjectHeader subject={subject} />

      <div className="enforcement-flags">
        <h3><Snippet>flag.heading</Snippet></h3>

        <p><strong><Snippet>flag.status.read</Snippet></strong></p>
        <EnforcementBanner enforcementCase={enforcementCase} status={status} />

        <p><strong><Snippet>flag.appliedTo.heading</Snippet></strong></p>
        <ul>
          {
            profileFlag &&
              <li key={profileFlag.id}>
                <Fragment>
                  <Link page="profile.read" establishmentId={profileFlag.establishmentId} profileId={profileFlag.profile.id} label={<Snippet profile={profileFlag.profile}>fields.flags.options.profile.label</Snippet>} />
                  <Snippet>fields.flags.options.profile.hint</Snippet>
                </Fragment>
              </li>
          }
          {
            pilFlag &&
              <li key={pilFlag.id}>
                <Fragment>
                  <Link page="pil.read" establishmentId={pilFlag.pil.establishmentId} profileId={pilFlag.profile.id} label={<Snippet profile={pilFlag.profile}>fields.flags.options.pil.label</Snippet>} />
                  <Snippet>fields.flags.options.pil.hint</Snippet>
                </Fragment>
              </li>
          }
          {
            projectFlags.map(flag => (
              <li key={flag.id}>
                <Link page="project.read" establishmentId={flag.establishmentId} projectId={flag.modelId} label={<Snippet profile={flag.profile} project={flag.project}>fields.flags.options.project.label</Snippet>} />
                <Snippet>fields.flags.options.project.hint</Snippet>
              </li>
            ))
          }
        </ul>

        <a href="#" className="govuk-button button-secondary" onClick={toggleEdit(subject.id)}>
          <Snippet>action.editFlag</Snippet>
        </a>
      </div>

    </div>
  );
}

export default EnforcementSubjectRead;
