import React from 'react';
import { StickyNavAnchor, Snippet } from '@ukhomeoffice/asl-components';
import EstablishmentDiff from './establishment-diff';

const TransferEstablishment = ({ task }) => (
  <StickyNavAnchor id="establishment" key="establishment">
    <h2><Snippet>sticky-nav.establishment</Snippet></h2>
    <div className="gutter">
      <EstablishmentDiff task={task} />
    </div>
  </StickyNavAnchor>
);

export default TransferEstablishment;
