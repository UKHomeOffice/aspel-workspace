import get from 'lodash/get';
import React, { Fragment } from 'react';
import { Snippet } from '@ukhomeoffice/asl-components';
import { format } from 'date-fns';
import { dateFormat } from '../../../../../../constants';

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
        <span>{format(standardDeadline, dateFormat.long)}</span>
      </p>
      <p>
        <strong>
          <Snippet>deadline.extension.to</Snippet>
        </strong>{' '}
        <span>{format(extendedDeadline, dateFormat.long)}</span>
      </p>
    </Fragment>
  );
}
