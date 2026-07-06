import React, { Fragment } from 'react';

import {
  Snippet,
  Link
} from '@ukhomeoffice/asl-components';
import { format } from 'date-fns';
import { dateFormat } from '../../../constants';
import { Warning } from '@ukhomeoffice/react-components';
const namedRoles = require('../../role/content/named-roles');
const skillsAndExperienceContent = require('../../role/named-person-mvp/content/skills-and-experience');
const { SHARED_TRAINING_INTRO_ROLE_TYPES } = require('../../role/named-person-mvp/role-types');

const checkExemptionDelay = (mandatoryTraining) => {
  const isExemption = Array.isArray(mandatoryTraining)
    ? mandatoryTraining.includes('exemption')
    : mandatoryTraining === 'exemption';
  const isDelay = Array.isArray(mandatoryTraining)
    ? mandatoryTraining.includes('delay')
    : mandatoryTraining === 'delay';

  return { isExemption, isDelay };
};

const ExemptionRequest = () => {
  return (
    <>
      <dt><strong><Snippet>explanation.exemptionRequest</Snippet></strong></dt>
      <dd />
    </>
  );
};

const NVSRole = ({ incompleteTraining, mandatoryTraining }) => {
  const { isDelay } = checkExemptionDelay(mandatoryTraining);
  return (
    <>
      {isDelay && (
        <>
          <dt className="govuk-!-margin-bottom-2"><Snippet>explanation.nvs.trainingNotComplete</Snippet></dt>
          <dd>
            <dl className="continuation">
              <dt><Snippet>explanation.nvs.reasonForDelay</Snippet></dt>
              <dd>{incompleteTraining.delayReason}</dd>
              <dt><Snippet>explanation.nvs.completionDate</Snippet></dt>
              <dd>{format(incompleteTraining.completeDate, dateFormat.long)}</dd>
            </dl>
          </dd>
        </>
      )}
    </>
  );
};

const NACWORole = ({ incompleteTraining, mandatoryTraining }) => {
  const { isDelay } = checkExemptionDelay(mandatoryTraining);
  const incompleteModules = [].concat(incompleteTraining.incomplete || []).join(', ');

  return (
    <>
      {isDelay && (
        <>
          <dt className="govuk-!-margin-bottom-2"><Snippet>explanation.nacwo.delay</Snippet></dt>
          <dd>
            <dl className="continuation">
              <dt><Snippet>explanation.nacwo.trainingNotComplete</Snippet></dt>
              <dd className="govuk-!-margin-bottom-2">{incompleteModules}</dd>
              <dt><Snippet>explanation.nacwo.reasonForDelay</Snippet></dt>
              <dd className="govuk-!-margin-bottom-2">{incompleteTraining.delayReason}</dd>
              <dt><Snippet>explanation.nacwo.completionDate</Snippet></dt>
              <dd>{format(incompleteTraining.completeDate, dateFormat.long)}</dd>
            </dl>
          </dd>
        </>
      )}
    </>
  );
};

export const DetailsByRole = ({ incompleteTraining, mandatoryTraining, role, roleDetails, showHeading = false, showEditLink = false }) => {
  const { isExemption, isDelay } = checkExemptionDelay(mandatoryTraining);
  const hasTrainingComplete = mandatoryTraining === 'yes';
  const hasNvsRcvsNumber = role === 'nvs' && !!roleDetails?.rcvsNumber;
  const hasDetailsByRoleData = hasTrainingComplete || isExemption || isDelay || hasNvsRcvsNumber;

  if (!hasDetailsByRoleData) {
    return null;
  }

  return (
    <>
      {showHeading && (
        <h2 className="margin-bottom">
          <Snippet>explanation.trainingHeading</Snippet>
        </h2>
      )}

      {isExemption && <ExemptionRequest /> }
      { role === 'nacwo' && <NACWORole incompleteTraining={incompleteTraining} mandatoryTraining={mandatoryTraining} /> }
      { role === 'nvs' && <NVSRole incompleteTraining={incompleteTraining} mandatoryTraining={mandatoryTraining} /> }
      { mandatoryTraining === 'yes' && (
        <dt className="govuk-!-margin-bottom-2"><Snippet>explanation.trainingComplete</Snippet></dt>
      )}

      {showEditLink && (
        <div>
          <dt />
          <dd><Link page={'role.namedPersonMvp'} suffix='/mandatory-training' label={<Snippet>buttons.edit</Snippet>} /></dd>
        </div>
      )}
    </>
  );
};

export const SkillsAndExperience = ({ roleType, profile, values = {}, showHeading = false, showEditLink = false }) => {
  const contentKey = skillsAndExperienceContent.fields[roleType] ? roleType : 'default';
  const contentForRole = skillsAndExperienceContent.fields[contentKey] || {};
  const fieldKeys = Object.keys(contentForRole).filter(key => key !== 'desc');
  const hasSkillsAndExperienceData = fieldKeys.some(fieldKey => {
    const value = values[fieldKey];
    return typeof value === 'string' ? value.trim() : value;
  });

  if (!hasSkillsAndExperienceData) {
    return null;
  }

  return (
    <>
      {showHeading && (
        <h2 className="margin-bottom">
          <Snippet>explanation.skillsAndExperienceHeading</Snippet>
        </h2>
      )}

      {!SHARED_TRAINING_INTRO_ROLE_TYPES.includes(roleType) && contentForRole.desc && (
        <div>
          <dt><Snippet roleType={namedRoles[roleType]} profile={profile}>{`fields.${contentKey}.desc`}</Snippet></dt>
          <dd />
        </div>
      )}

      {fieldKeys.map(fieldKey => (
        <div key={fieldKey}>
          <dt><Snippet roleType={namedRoles[roleType]} profile={profile}>{`fields.${contentKey}.${fieldKey}.label`}</Snippet></dt>
          <dd>{values[fieldKey]}</dd>
        </div>
      ))}

      {showEditLink && (
        <div>
          <dt />
          <dd><Link page={'role.namedPersonMvp'} suffix='/skills-and-experience' label={<Snippet>buttons.edit</Snippet>} /></dd>
        </div>
      )}
    </>
  );
};

export const NamedPersonDetails = ({ roleType, profile, props, profileReplaced, roleDetails, showEditLink = false }) => {
  const hasNamedPersonDetails = !!(
    roleType ||
    profile?.firstName ||
    profile?.lastName
  );

  if (!hasNamedPersonDetails) {
    return null;
  }

  return (
    <>
      <dt><Snippet>applyingFor</Snippet></dt>
      <dd>{namedRoles[roleType]}</dd>

      <dt><Snippet>onBehalfOf</Snippet></dt>
      <dd>
        {`${profile.firstName} ${profile.lastName}`}
        { profileReplaced && props?.action !== 'remove' &&
          <Warning>The existing {profileReplaced.type.toUpperCase()} {profileReplaced.firstName} {profileReplaced.lastName} will be removed from the role when this request is approved.</Warning>
        }
      </dd>

      {roleDetails?.rcvsNumber && (
        <>
          <dt><Snippet>explanation.nvs.rcvsNumber</Snippet></dt>
          <dd>{roleDetails.rcvsNumber}</dd>
        </>
      )}

      {showEditLink && <Link page={'role.namedPersonMvp'} label={<Snippet>buttons.edit</Snippet>} />}
    </>
  );
};
