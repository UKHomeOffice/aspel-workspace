import get from 'lodash/get';
import React, { Fragment } from 'react';
import { Snippet, Utils } from '@ukhomeoffice/asl-components';

export function DeadlineDetails({ item }) {
  const standardDeadline = get(item, 'event.data.deadline.standard');
  const extendedDeadline = get(item, 'event.data.deadline.extended');

  if (!standardDeadline || !extendedDeadline) {
    return null;
  }

  return (
    <Fragment>
      <p>
        <strong>
          <Snippet>deadline.extension.from</Snippet>
        </strong>{' '}
        <span>{Utils.formatDate(standardDeadline, Utils.DATE_FORMAT.long)}</span>
      </p>
      <p>
        <strong>
          <Snippet>deadline.extension.to</Snippet>
        </strong>{' '}
        <span>{Utils.formatDate(extendedDeadline, Utils.DATE_FORMAT.long)}</span>
      </p>
    </Fragment>
  );
}
