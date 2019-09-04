import React from 'react';
import { useSelector } from 'react-redux';
import { Warning } from '@ukhomeoffice/react-components';
import { Snippet } from '../';

export default function OpenTaskWarning() {
  const model = useSelector(state => state.model);

  if (!model.openTasks || !model.openTasks.length) {
    return null;
  }

  return <Warning><Snippet>warnings.openTask</Snippet></Warning>;
}
