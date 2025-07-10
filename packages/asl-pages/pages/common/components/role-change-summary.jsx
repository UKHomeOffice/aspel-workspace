import React, { Fragment } from 'react';

import {
  Snippet
} from '@ukhomeoffice/asl-components';
import { format } from 'date-fns';
import { dateFormat } from '../../../constants';
import { Warning } from '@ukhomeoffice/react-components';
import namedRoles from '../../role/content/named-roles';

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
    <p>
      <dt><Snippet>explanation.exemptionRequest</Snippet></dt>
    </p>
  );
};

const NamedPersonRoleDetails = ({ roleType, profile, props, profileReplaced }) => {
  return (
    <>
      <dt><Snippet>applyingFor</Snippet></dt>
      <dd>{namedRoles[roleType]}</dd>

      <dt><Snippet>onBehalfOf</Snippet></dt>
      <dd>
        {`${profile.firstName} ${profile.lastName}`}
        { profileReplaced && props.action !== 'remove' &&
          <Warning>The existing {profileReplaced.type.toUpperCase()} {profileReplaced.firstName} {profileReplaced.lastName} will be removed from the role when this request is approved.</Warning>
        }
      </dd>
    </>
  );
};

const NVSRole = ({ nvs, incompleteTraining, mandatoryTraining }) => {
  const { isExemption, isDelay } = checkExemptionDelay(mandatoryTraining);
  return (
    <>
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
    </>
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
          <dt><Snippet>explanation.nacwo.trainingToComplete</Snippet></dt>
          <dd>{incompleteModules}</dd>
          <dt><Snippet>explanation.nacwo.reasonForDelay</Snippet></dt>
          <dd>{incompleteTraining.delayReason}</dd>
          <dt><Snippet>explanation.nacwo.trainingDate</Snippet></dt>
          <dd>{format(incompleteTraining.completeDate, dateFormat.long)}</dd>
        </>
      )}
    </>
  );
};

module.exports = { NACWORole, NVSRole, NamedPersonRoleDetails };
