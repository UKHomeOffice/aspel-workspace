import React from 'react';
import { Snippet, Panel } from '@asl/components';

const Success = () => (
  <div className="govuk-grid-row">
    <div className="govuk-grid-column-two-thirds">
      <Panel title={<Snippet>title</Snippet>} className="green-bg" />
    </div>
  </div>
);

export default Success;
