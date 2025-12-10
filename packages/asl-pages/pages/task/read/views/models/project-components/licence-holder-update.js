import React from 'react';
import { StickyNavAnchor, Snippet, Diff } from '@ukhomeoffice/asl-components';
import pick from 'lodash/pick';

const LicenceHolderUpdate = ({
  values,
  task,
  isComplete,
  projectSchema,
  formatters
}) => (
  <StickyNavAnchor id="licence-holder" key="licence-holder">
    <h2><Snippet>sticky-nav.licence-holder</Snippet></h2>
    <Diff
      before={values}
      after={{ licenceHolder: task.data.licenceHolder }}
      schema={pick(projectSchema, 'licenceHolder')}
      formatters={formatters}
      currentLabel={<Snippet>{`diff.${isComplete ? 'previous' : 'current'}`}</Snippet>}
      proposedLabel={<Snippet>{`diff.${isComplete ? 'changed-to' : 'proposed'}`}</Snippet>}
    />
  </StickyNavAnchor>
);

export default LicenceHolderUpdate;
