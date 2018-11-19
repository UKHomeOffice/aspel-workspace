import React, { Fragment } from 'react';
import { Alert } from '../';

const Wrapper = ({ children }) => (
  <Fragment>
    <Alert />
    { children }
  </Fragment>
);

export default Wrapper;
