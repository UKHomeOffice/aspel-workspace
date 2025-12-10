import React from 'react';
import { StickyNavAnchor, Snippet, Link } from '@ukhomeoffice/asl-components';
import { Warning } from '../../../../../common/components/warning';

const TransferWarning = ({ isAdmin, isHolc, project, establishment }) => (
  <StickyNavAnchor id="establishment" key="establishment">
    <>
      <Warning>
        <Snippet>warning.establishment.move</Snippet>
      </Warning>
      <div className='govuk-warning-text'>
        <strong className='govuk-warning-text__text'>
          <Link
            page="project.read"
            establishmentId={project.establishmentId}
            projectId={project.id}
            label={<Snippet>warning.establishment.downloadLabel</Snippet>}
            target='downloads'
            suffix='#reporting'
          />&nbsp;
          <Snippet>warning.establishment.suffix</Snippet>
        </strong>
      </div>
    </>
  </StickyNavAnchor>
);

export default TransferWarning;
