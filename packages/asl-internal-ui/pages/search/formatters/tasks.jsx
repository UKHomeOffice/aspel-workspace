import React, { Fragment } from 'react';
import get from 'lodash/get';
import { Link, Markdown, Snippet } from '@ukhomeoffice/asl-components';
import taskFormatters from '@asl/pages/pages/task/list/formatters';

const LicenceLabelWithNumber = ({label, result}) => {
  const highlight = get(result, `highlight.licenceNumber[0]`);
  const licenceNumber = highlight ? <Markdown>{highlight}</Markdown> : get(result, 'licenceNumber');

  return <Fragment>
    <span>{label}</span>
    <span className="block smaller">{licenceNumber}</span>
  </Fragment>;
};

export default {
  updatedAt: taskFormatters.updatedAt,

  establishment: {
    format: (establishmentName, result) => {
      const highlight = get(result, `highlight['establishment.name'][0]`);
      return highlight ? <Markdown>{highlight}</Markdown> : establishmentName;
    }
  },

  licence: {
    format: (model, result) => {
      switch (model) {
        case 'pil':
          return <LicenceLabelWithNumber label="PIL" result={result} />;
        case 'trainingPil':
          return <LicenceLabelWithNumber label="PIL-E" result={result} />;
        case 'project':
          return <LicenceLabelWithNumber label="PPL" result={result} />;
        case 'rop':
          return 'PPL';
        case 'place':
        case 'role':
        case 'establishment':
          return 'PEL';
        default: return '-';
      }
    }
  },

  type: {
    format: (type, result) => {
      const taskId = get(result, 'id');
      const status = get(result, 'modelStatus');
      let model = get(result, 'model');

      const normalisedType = type === 'grant' && status === 'active' ? 'update' : type;

      let contextLabel = null;
      let title = null;

      if (model === 'project') {
        title = get(result, 'projectTitle') || 'Untitled project';
      }

      switch (model) {
        case 'establishment':
        case 'project':
        case 'pil':
        case 'trainingPil':
        case 'role':
        case 'profile':
          const subject = get(result, 'subject');
          if (subject) {
            const name = get(result, `highlight['subject.name'][0]`); // partial match on name
            const firstName = get(result, `highlight['subject.firstName'][0]`, subject.firstName);
            const lastName = get(result, `highlight['subject.lastName'][0]`, subject.lastName);
            contextLabel = name ? <Markdown>{name}</Markdown> : <Markdown>{`${firstName} ${lastName}`}</Markdown>;
          }
          break;

        case 'place':
          const placeName = get(result, 'placeName');
          if (placeName) {
            contextLabel = placeName;
          }
          break;
      }

      return (
        <div title={title}>
          <Link
            page="task.read"
            taskId={taskId}
            // adding optional snippet for backwards compatibility
            // as some task types won't have content defined.
            label={<Snippet optional>{`tasks.${model}.${normalisedType}`}</Snippet>}
          />
          {
            contextLabel && <span className="block smaller">{contextLabel}</span>
          }
        </div>
      );
    }
  },

  status: taskFormatters.status,

  assignedTo: {
    format: (assignedTo, result) => {
      if (!assignedTo) {
        return <em>Unassigned</em>;
      }
      const name = get(result, `highlight['assignedTo.name'][0]`); // partial match on name
      const firstName = get(result, `highlight['assignedTo.firstName'][0]`, assignedTo.firstName);
      const lastName = get(result, `highlight['assignedTo.lastName'][0]`, assignedTo.lastName);
      const label = name ? <Markdown>{name}</Markdown> : <Markdown>{`${firstName} ${lastName}`}</Markdown>;
      return <Link page="globalProfile" label={label} profileId={assignedTo.id} />;
    }
  }
};
