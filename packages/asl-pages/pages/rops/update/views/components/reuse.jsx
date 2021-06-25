import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Snippet } from '@asl/components';

export default function Reuse() {
  const reuse = useSelector(state => state.static.hasReUse);
  return (
    <Fragment>
      <h3><Snippet>playback</Snippet></h3>
      <ul>
        <li>
          <Snippet>{`fields.reuse.playback.${reuse}`}</Snippet>
        </li>
      </ul>
    </Fragment>
  );
}
