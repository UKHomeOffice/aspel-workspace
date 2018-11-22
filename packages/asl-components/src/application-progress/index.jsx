import React from 'react';
import classnames from 'classnames';
import { Snippet } from '../';

const ApplicationProgress = ({ states = [] }) => (
  <ul className="application-progress">
    {
      states.map(({ state, active, complete }) => (
        <li key={state} className={classnames({ complete, active })}><Snippet>{`states.${state}`}</Snippet></li>
      ))
    }
  </ul>
);

export default ApplicationProgress;
