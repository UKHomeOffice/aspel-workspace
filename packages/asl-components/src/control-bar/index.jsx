import React from 'react';
import classnames from 'classnames';

const ControlBar = ({ block = false, children }) => (
  <div className={classnames('control-bar', { block })}>
    { children }
  </div>
);

export default ControlBar;
