import React, { Fragment } from 'react';
import { Notifiction } from '../';

const Wrapper = ({ children }) => (
  <Fragment>
    <Notification />
    { children }
  </Fragment>
);

export default Wrapper;
