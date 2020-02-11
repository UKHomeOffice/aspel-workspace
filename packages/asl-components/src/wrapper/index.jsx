import React, { Fragment } from 'react';
import { Notification } from '../';

const Wrapper = ({ children }) => (
  <Fragment>
    <Notification />
    { children }
  </Fragment>
);

export default Wrapper;
