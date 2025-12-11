import React, { Fragment } from 'react';

export function LicenceNumber({ children }) {
  if (!children) {
    return null;
  }

  return (
    <Fragment>
      <dt>Licence number</dt>
      <dd>{ children }</dd>
    </Fragment>
  );
}
