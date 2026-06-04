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
      <dt><Snippet>explanation.exemptionRequest</Snippet></dt>
    </>
  );
};

const NVSRole = ({ nvs, incompleteTraining, mandatoryTraining }) => {
  const { isExemption, isDelay } = checkExemptionDelay(mandatoryTraining);
  return (
    <dl>
      {nvs.rcvsNumber && (
        <>
          <dt><Snippet>explanation.nvs.rcvsNumber</Snippet></dt>
          <dd>{nvs.rcvsNumber}</dd>
        </>
      )}

      {isExemption && <ExemptionRequest /> }

      {isDelay && (
        <>
          <dt><Snippet>explanation.nvs.trainingNotComplete</Snippet></dt>
          <dd />
          <dt><Snippet>explanation.nvs.reasonForDelay</Snippet></dt>
          <dd>{incompleteTraining.delayReason}</dd>
          <dt><Snippet>explanation.nvs.completionDate</Snippet></dt>
          <dd>{format(incompleteTraining.completeDate, dateFormat.long)}</dd>
        </>
      )}
    </dl>
  );
};

const NACWORole = ({ incompleteTraining, mandatoryTraining }) => {
  const { isExemption, isDelay } = checkExemptionDelay(mandatoryTraining);
  const incompleteModules = [].concat(incompleteTraining.incomplete || []).join(', ');

  return (
    <>
      {isExemption && <ExemptionRequest /> }

      {isDelay && (
        <>
          <dt><Snippet>explanation.nacwo.delay</Snippet></dt>
          <dd />
          <dt><Snippet>explanation.nacwo.trainingNotComplete</Snippet></dt>
          <dd>{incompleteModules}</dd>
          <dt><Snippet>explanation.nacwo.reasonForDelay</Snippet></dt>
          <dd>{incompleteTraining.delayReason}</dd>
          <dt><Snippet>explanation.nacwo.completionDate</Snippet></dt>
          <dd>{format(incompleteTraining.completeDate, dateFormat.long)}</dd>
        </>
      )}
    </>
  );
};

export const DetailsByRole = ({ incompleteTraining, mandatoryTraining, role, roleDetails }) => {
  const { isExemption, isDelay } = checkExemptionDelay(mandatoryTraining);
  const hasTrainingComplete = mandatoryTraining === 'yes';
  const hasNvsRcvsNumber = role === 'nvs' && !!roleDetails?.rcvsNumber;
  const hasDetailsByRoleData = hasTrainingComplete || isExemption || isDelay || hasNvsRcvsNumber;

  if (!hasDetailsByRoleData) {
    return null;
  }

  return (
    <>
      <h2 className="margin-bottom">
        <Snippet>explanation.trainingHeading</Snippet>
      </h2>

      { role === 'nacwo' && <NACWORole incompleteTraining={incompleteTraining} mandatoryTraining={mandatoryTraining} /> }
      { role === 'nvs' && <NVSRole nvs={roleDetails} incompleteTraining={incompleteTraining} mandatoryTraining={mandatoryTraining} /> }
      { mandatoryTraining === 'yes' && (
        <dt><Snippet>explanation.trainingComplete</Snippet></dt>
      )}

      <Link page={'role.namedPersonMvp'} suffix='/mandatory-training' label={<Snippet>buttons.edit</Snippet>} />
    </>
  );
};

export const SkillsAndExperience = ({ roleType, profile, values = {} }) => {
  const contentKey = skillsAndExperienceContent.fields[roleType] ? roleType : 'default';
  const fieldKeys = Object.keys(skillsAndExperienceContent.fields[contentKey] || {}).filter(key => key !== 'desc');
  const hasSkillsAndExperienceData = fieldKeys.some(fieldKey => {
    const value = values[fieldKey];
    return typeof value === 'string' ? value.trim() : value;
  });

  if (!hasSkillsAndExperienceData) {
    return null;
  }

  return (
    <section>
      <h2 className="margin-bottom">
        <Snippet>explanation.skillsAndExperienceHeading</Snippet>
      </h2>

      <dt><Snippet roleType={namedRoles[roleType]} profile={profile}>{`fields.${contentKey}.desc`}</Snippet></dt>

      <dl>
        {fieldKeys.map(fieldKey => (
          <Fragment key={fieldKey}>
            <dd />
            <dd />
            <dt><Snippet roleType={namedRoles[roleType]} profile={profile}>{`fields.${contentKey}.${fieldKey}.label`}</Snippet></dt>
            <dd>{values[fieldKey]}</dd>
          </Fragment>
        ))}
      </dl>

      <Link page={'role.namedPersonMvp'} suffix='/skills-and-experience' label={<Snippet>buttons.edit</Snippet>} />
    </section>
  );
};

export const NamedPersonDetails = ({ roleType, profile, props, profileReplaced }) => {
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

      <Link page={'role.namedPersonMvp'} label={<Snippet>buttons.edit</Snippet>} />
    </>
  );
};
