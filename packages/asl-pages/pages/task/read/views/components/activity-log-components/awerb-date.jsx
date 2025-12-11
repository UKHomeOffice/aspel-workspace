import get from 'lodash/get';
import { format } from 'date-fns';
import { dateFormat } from '../../../../../../constants';
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
      {format(awerb, dateFormat.long)}
    </p>
  );
}
