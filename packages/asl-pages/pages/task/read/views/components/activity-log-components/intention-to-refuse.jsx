import get from 'lodash/get';
import React, { Fragment } from 'react';
import { Inset, Markdown } from '@ukhomeoffice/asl-components';

export function IntentionToRefuse({ task }) {
  const intentionToRefuse = get(task, 'data.intentionToRefuse');

  if (!intentionToRefuse) {
    return null;
  }

  return (
    <Fragment>
      <p>
        <strong>Refusal notice:</strong>
      </p>
      <Inset>
        <Markdown>{intentionToRefuse.markdown}</Markdown>
      </Inset>
    </Fragment>
  );
}
