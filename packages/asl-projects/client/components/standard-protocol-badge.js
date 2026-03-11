import React from 'react';

export default function StandardProtocolBadge({ values }) {

if (values.isStandardProtocol)
  return <span className={'badge standard-protocol '}>STANDARD</span>;
}
