import React from 'react';
import { StickyNavAnchor, Snippet } from '@ukhomeoffice/asl-components';
import { Warning } from '../../../../../common/components/warning';

const TransferRopWarning = ({ ropDue }) => (
  <StickyNavAnchor id="establishment" key="establishment">
    <Warning>
      <Snippet years={ropDue}>warning.establishment.transferRopDue</Snippet>
    </Warning>
  </StickyNavAnchor>
);

export default TransferRopWarning;
