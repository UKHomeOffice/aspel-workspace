import React, { createElement as h } from 'react';
import Alert from '@hods/alert';

export const AlertBanner = ({ heading, message }) => (
  <Alert heading={heading}>
    {message}
  </Alert>
);

export default AlertBanner;
