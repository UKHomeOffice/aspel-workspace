import React, { Fragment } from 'react';
import { BackToTop, Notification } from '../';

const Wrapper = ({ children }) => (
  <Fragment>
    <Notification />
    { children }
    <BackToTop showAt={400} />
  </Fragment>
);

export default Wrapper;
