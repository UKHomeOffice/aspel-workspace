import React, { Fragment } from 'react';
import { BackToTop, Notification } from '../';

const Wrapper = ({ children }) => (
  <Fragment>
    <Notification />
    { children }
    <BackToTop />
  </Fragment>
);

export default Wrapper;
