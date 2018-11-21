import React from 'react';
import classnames from 'classnames';
import { Snippet } from '../';

const ApplicationStatus = ({ states = [], current }) => {
  current = current || states[0];

  return (
    <ul className="application-status">
      {
        states.map(state => (
          <li key={state} className={classnames({ complete: state === current })}><Snippet>{`states.${state}`}</Snippet></li>
        ))
      }
    </ul>
  );
};

export default ApplicationStatus;
