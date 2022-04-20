import React, { Fragment } from 'react';
import get from 'lodash/get';
import { Snippet, Link } from '@asl/components';
import EnforcementSubjectHeader from './subject-header';
import EnforcementBanner from '../../../components/enforcement-banner';

function EnforcementSubjectRead({ enforcementCase, subject, idx, toggleEdit }) {
  const status = get(subject, 'flags[0].status'); // all flags have same status
  const remedialAction = status === 'closed' && get(subject, 'flags[0].remedialAction'); // all flags have same remedial action
  const profileFlag = subject.flags.find(flag => flag.modelType === 'profile');
  const pilFlag = subject.flags.find(flag => flag.modelType === 'pil');
  const projectFlags = subject.flags.filter(flag => flag.modelType === 'project');
  const pelFlags = subject.flags.filter(flag => flag.modelType === 'establishment');

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
                  <Link page="pil.read" establishmentId={pilFlag.pil.establishmentId} profileId={subject.profileId} label={<Snippet profile={subject.profile}>fields.flags.options.pil.label</Snippet>} />
                  <Snippet>fields.flags.options.pil.hint</Snippet>
                </Fragment>
              </li>
          }
          {
            projectFlags.map(flag => (
              <li key={flag.id}>
                <Link page="project.read" establishmentId={flag.establishmentId} projectId={flag.modelId} label={<Snippet profile={subject.profile} project={flag.project}>fields.flags.options.project.label</Snippet>} />
                <Snippet>fields.flags.options.project.hint</Snippet>
              </li>
            ))
          }
          {
            pelFlags.map(flag => (
              <li key={flag.id}>
                <Link page="establishment.read" establishmentId={flag.establishmentId} label={<Snippet profile={subject.profile} establishment={flag.establishment}>fields.flags.options.establishment.label</Snippet>} />
                <p><Snippet>fields.flags.options.establishment.hint</Snippet></p>
                <ul>
                  {
                    flag.modelOptions.includes('places') &&
                      <li><Snippet>fields.flags.options.establishment.modelOptions.places</Snippet></li>
                  }
                  {
                    flag.modelOptions.includes('roles') &&
                      <li><Snippet>fields.flags.options.establishment.modelOptions.roles</Snippet></li>
                  }
                  {
                    flag.modelOptions.includes('details') &&
                      <li><Snippet>fields.flags.options.establishment.modelOptions.details</Snippet></li>
                  }
                </ul>
              </li>
            ))
          }
        </ul>

        {
          remedialAction &&
            <div className="remedial-action">
              <p><strong><Snippet>flag.remedialAction.heading</Snippet></strong></p>
              {
                remedialAction.length === 1
                  ? <p><Snippet>{`fields.remedialAction.options.${remedialAction[0]}.label`}</Snippet></p>
                  : <ul>
                    {
                      remedialAction.map(action =>
                        <li key={action}><Snippet>{`fields.remedialAction.options.${action}.label`}</Snippet></li>
                      )
                    }
                  </ul>
              }
            </div>
        }

        <a href="#" className="govuk-button button-secondary" onClick={toggleEdit(subject)}>
          <Snippet>action.editFlag</Snippet>
        </a>
      </div>

    </div>
  );
}

export default EnforcementSubjectRead;
