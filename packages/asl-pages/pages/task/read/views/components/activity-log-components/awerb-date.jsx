import get from 'lodash/get';
import { Utils } from '@ukhomeoffice/asl-components';
import React from 'react';

export function AwerbDate({ item }) {
  const awerb = get(item, 'event.meta.payload.meta.ra-awerb-date');

  if (!awerb) {
    return null;
  }

  return (
    <p>
      Date of the most recent AWERB review
      <br />
      {Utils.formatDate(awerb, Utils.DATE_FORMAT.long)}
    </p>
  );
}
