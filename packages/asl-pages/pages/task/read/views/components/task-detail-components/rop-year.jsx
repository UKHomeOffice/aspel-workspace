import { useSelector } from 'react-redux';
import React, { Fragment } from 'react';

export function RopYear({ task }) {
  if (task.data.model !== 'rop') {
    return null;
  }
  const year = useSelector(state => state.static.values.year);
  return <Fragment>
    <dt>Return for year</dt>
    <dd>{ year }</dd>
  </Fragment>;
}
