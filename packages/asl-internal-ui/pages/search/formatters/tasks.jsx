import React, { Fragment } from 'react';
import get from 'lodash/get';
import { Link, Markdown, Snippet } from '@asl/components';
import taskFormatters from '@asl/pages/pages/task/list/formatters';

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
      const highlight = get(result, `highlight.licenceNumber[0]`);
      const licenceNumber = highlight ? <Markdown>{highlight}</Markdown> : get(result, 'licenceNumber');

      if (model === 'pil' || model === 'trainingPil') {
        return (
          <Fragment>
            <span>PIL</span>
            <span className="block smaller">{licenceNumber}</span>
          </Fragment>
        );
      }
      if (model === 'project') {
        return (
          <Fragment>
            <span>PPL</span>
            <span className="block smaller">{licenceNumber}</span>
          </Fragment>
        );
      }
      if (model === 'rop') {
        return 'PPL';
      }
      if (model === 'place' || model === 'role' || model === 'establishment') {
        return 'PEL';
      }
      return '-';
    }
  },

  type: {
    format: (type, result) => {
      const taskId = get(result, 'id');
      const status = get(result, 'modelStatus');
      let model = get(result, 'model');

      if (model === 'trainingPil') {
        model = 'pil';
      }

      if (type === 'grant' && status === 'active') {
        type = 'update';
      }

      let contextLabel = null;
      let title = null;

      if (model === 'project') {
        title = get(result, 'projectTitle') || 'Untitled project';
      }

      switch (model) {
        case 'project':
        case 'pil':
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
            // as some task types wont have content defined.
            label={<Snippet optional>{`tasks.${model}.${type}`}</Snippet>}
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
